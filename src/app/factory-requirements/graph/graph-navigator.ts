import {
  CraftingSiteNode,
  FactoryEdge,
  GraphFactoryNodeFactoryEdge,
  GraphFactoryNodeFactoryEdgeNodesInner,
} from "../../factory-planner-api";
import {Edge, Node} from "@swimlane/ngx-graph";
import {isNil, max, sum} from "lodash";
import {createNode, isCraftingSiteNode, isExtractingSiteNode, isItemSiteNode, SealedRequirement} from "./node.factory";
import {CraftingSiteNodeImpl} from "./crafting-site.node";
import {ItemSiteNodeImpl} from "./item-site.node";
import {ExtractingSiteNodeImpl} from "./extracting-site.node";
import {Subject} from "rxjs";
import {SealedSuppliedItem} from "../factory-requirements.component";


export type GraphNode = Node & (CraftingSiteNodeImpl) | ExtractingSiteNodeImpl | ItemSiteNodeImpl;
export type GraphEdge = Edge & FactoryEdge;


export class GraphNavigator {
  nodes: GraphNode[] = [];
  edges: GraphEdge[] = [];


  constructor(public requirements: SealedRequirement[], private suppliedItems: SealedSuppliedItem[], readonly updateGraphSubject: Subject<boolean>) {
  }


  populate({nodes, edges}: GraphFactoryNodeFactoryEdge) {
    nodes.forEach((node) => {
      if (!this.isNodeExisting(node)) {
        this.nodes.push(createNode(node) as GraphNode);
      }
    })

    edges.forEach(edge => {
      if (!this.isEdgeExisting(edge)) {
        this.edges.push(edge);
      }

    })


    this.actualizeGraph()
  }

  getRequiredTotal(className: string): number {
    const requirements = this.requirements.filter(e => !isNil(e.item) && e.item.className === className)

    return sum(requirements?.map(req => {
      return req.requiredAmount;
    }))
  }
  getSuppliedTotal(className: string): number {
    const requirements = this.suppliedItems.filter(e => !isNil(e.item) && e.item.className === className)

    return sum(requirements?.map(req => {
      return req.providedAmount;
    }));
  }


  computeLink(edge: FactoryEdge, withDebug = false): number | undefined {
    const source = this.nodes.find(e => e.id === edge.source)
    const target = this.nodes.find(e => e.id === edge.target)

    if (isItemSiteNode(source) && isCraftingSiteNode(target)) {
      return this.cycleToMinute(target, target.requiredMachines * edge.outputPerCycle!!)
    }
    if (isCraftingSiteNode(source) && isItemSiteNode(target)) {
      return this.cycleToMinute(source, source.requiredMachines * edge.outputPerCycle!!)
    }
    if (isExtractingSiteNode(source) && isItemSiteNode(target)) {
      return edge.totalOutputPerMinute
    }
    return undefined
  }

  getTotalItemProducedItems(node: ItemSiteNodeImpl) {
    const recipes = this.getIncomingEdges(node).map(edge => edge.totalOutputPerMinute)

    return max(recipes) || 0;
  }

  getTotalItemRequiredItems(node: ItemSiteNodeImpl) {
    const recipes = this.getOutgoingEdge(node).map(edge => edge.totalOutputPerMinute)

    return sum(recipes);
  }

  displayNumber(nb: number | undefined): string {
    if (isNil(nb)) {
      return ''
    }
    return Number(nb).toFixed(3)
  }

  getItemNumberDisplay(node: ItemSiteNodeImpl) {
    const producerEdges = this.getIncomingEdges(node)
    const consumerEdges = this.getOutgoingEdge(node)
    const totalRequired = sum(consumerEdges.map(edge => edge.totalOutputPerMinute))
    const totalProduced = sum(producerEdges.map(edge => edge.totalOutputPerMinute))

    return (totalProduced - totalRequired)
  }

  actualizeGraph(requirements: SealedRequirement[] | undefined = undefined, suppliedItems: SealedSuppliedItem[] | undefined = undefined): void {
    if (!isNil(requirements)) {
      this.requirements = requirements
    }
    if (!isNil(suppliedItems)) {
      this.suppliedItems = suppliedItems
    }
    const itemNodes = this.nodes.filter(item => item instanceof ItemSiteNodeImpl)

    this.edges.forEach(edge => {
      edge.totalOutputPerMinute = 0
    })

    itemNodes
      .filter(item => this.getRequiredTotal(item.factorySiteTarget.className) > 0)
      .forEach((item) => {
        // Get item requirements from user

        this.computeItemRequirement(item, this.getRequiredTotal(item.factorySiteTarget.className))
      })
    this.edges.forEach(e => {
      const total = this.computeLink(e)

      if (total) {
        e.totalOutputPerMinute = total
      }
    })
    this.nodes.filter(node => node instanceof CraftingSiteNodeImpl).forEach(craftingSite => {
      const producedItemEdges = this.getOutgoingEdge(craftingSite)

      producedItemEdges
        .forEach(edge => {
          const actualProduced = this.computeLink(edge)!!
          const producedItem = this.nodes.find(node => node.id === edge.target)!!
          const requiredItems = this.getTotalItemRequiredItems(producedItem)
          const failedToMatchRequirement = actualProduced < requiredItems

          if (failedToMatchRequirement && !this.isCyclicRelationship(craftingSite, producedItem)) {
            console.log('Recalculation', craftingSite.id, producedItem.id, actualProduced, requiredItems)

            const requiredCycles = this.computeRecipe(craftingSite, producedItem, requiredItems)

            if (!isNil(requiredCycles)) {
              craftingSite.requiredMachines = requiredCycles
              edge.totalOutputPerMinute = requiredItems
            }
          }

        })
    })
    this.edges.forEach(e => {
      const total = this.computeLink(e)

      if (total) {
        e.totalOutputPerMinute = total
      }
    })
    itemNodes.forEach(item => {
      const producers = this.getIncomingEdges(item)

      producers.forEach(recipeEdge => {
        const recipe = this.nodes.find(recipeNode => recipeNode.id === recipeEdge.source)

        if (recipe instanceof ExtractingSiteNodeImpl) {

          const outgoing = this.getOutgoingEdge(item).map(e => e.totalOutputPerMinute)
          const incoming = this.getIncomingEdges(item).map(e => e.totalOutputPerMinute)

          recipeEdge.totalOutputPerMinute = (sum(outgoing) - sum(incoming)) + this.getRequiredTotal(item.factorySiteTarget.className)
        }
      })
    })

    this.edges.forEach(e => {
      const total = this.computeLink(e)

      if (total) {
        e.totalOutputPerMinute = total
      }
    })

    this.updateGraphSubject?.next(true)
  }

  private isCyclicRelationship(craftingSite: CraftingSiteNodeImpl, itemSite: ItemSiteNodeImpl): boolean {
    const craftingSiteProducedItems = this.getOutgoingEdge(craftingSite).some(e => e.target === itemSite.id && e.source === craftingSite.id)
    const craftingSiteIngredients = this.getIncomingEdges(craftingSite).some(e => e.source === itemSite.id && e.target === craftingSite.id)
    const isCyclic = craftingSiteProducedItems && craftingSiteIngredients

    return isCyclic
  }

  private getItemBalance(item: ItemSiteNodeImpl) {
    const producerEdges = this.getIncomingEdges(item)
    const consumerEdges = this.getOutgoingEdge(item)
    const totalRequired = sum(consumerEdges.map(edge => edge.totalOutputPerMinute)) + this.getRequiredTotal(item.factorySiteTarget.className)
    const totalProduced = sum(producerEdges.map(edge => edge.totalOutputPerMinute))

    return totalProduced - totalRequired
  }

  private computeRecipeRequiredMachines(recipe: CraftingSiteNodeImpl, productItem: ItemSiteNodeImpl, amountPerCycle: number): number {
    const recipeToItem = this.getOutgoingEdge(recipe).find(e => e.target === productItem?.id && e.source === recipe.id);

    return amountPerCycle / recipeToItem?.outputPerCycle!!
  }

  private computeRecipe(recipe: CraftingSiteNodeImpl, productItem: ItemSiteNodeImpl, requiredTotal: number, callstack: {
    recipe: string,
    item: string,
    requiredTotal: number,
  }[] = []) {
    if (callstack.filter(e => e.item === productItem.id && e.recipe === recipe.id).length > 100) {
      console.warn('Could not calculate looping recipe', recipe.id, productItem.id)
      throw new Error('Could not calculate looping recipe')
    }
    if (callstack.some(e => e.recipe === recipe.id && this.isEqualsFixed(requiredTotal, e.requiredTotal))) {
      console.warn('Balanced recipe to find convergence', recipe.id, productItem.id)
      return undefined
    }

    callstack.push({recipe: recipe.id, item: productItem.id, requiredTotal: requiredTotal})

    const requiredTotalPerCycle = this.minuteToCycle(recipe, requiredTotal)
    // - this.minuteToCycle(recipe, this.getSuppliedTotal(productItem.factorySiteTarget.className))

    return this.computeRecipeRequiredMachines(recipe, productItem, requiredTotalPerCycle)
  }

  private isEqualsFixed(nb: number, nb1: number): boolean {
    const fixedNb = Number(nb).toFixed(5);
    const fixedNb1 = Number(nb1).toFixed(5);

    return fixedNb === fixedNb1
  }

  private propagateIngredientCalculations(recipe: CraftingSiteNodeImpl, callstack: {
    recipe: string;
    item: string;
    requiredTotal: number
  }[]) {
    const ingredients = this.getIncomingEdges(recipe)

    for (const edge of ingredients) {
      const newTotalOutputPerCycle = recipe.requiredMachines * edge.outputPerCycle!!
      const ingredient = this.nodes.find(e => e.id === edge.source)

      if (ingredient && ingredient instanceof ItemSiteNodeImpl) {
        const ingredientTotal = this.cycleToMinute(recipe, newTotalOutputPerCycle) + this.getRequiredTotal(ingredient.factorySiteTarget.className)

        edge.totalOutputPerMinute = ingredientTotal
        this.computeItemRequirement(ingredient, ingredientTotal, callstack, recipe)
      }
    }
  }

  private computeItemRequirement(item: ItemSiteNodeImpl, requiredTotalPerMinute: number, callstack: {
    recipe: string;
    item: string;
    requiredTotal: number
  }[] = [], parent: CraftingSiteNodeImpl | undefined = undefined) {
    const producers = this.getIncomingEdges(item)

    producers.filter(recipeEdge => recipeEdge.source !== parent?.id).forEach(recipeEdge => {
      const recipe = this.nodes.find(recipeNode => recipeNode.id === recipeEdge.source)

      if (recipe instanceof CraftingSiteNodeImpl) {
        //  console.log('Wanna craft', item.id, 'with', recipe.id, ' to get ', requiredTotalPerMinute, ' / min')
        const requiredCycles = this.computeRecipe(recipe, item, requiredTotalPerMinute, callstack)
        const produced = this.computeLink(recipeEdge)

        if (!isNil(requiredCycles) && !isNil(produced)) {
          recipe.requiredMachines = requiredCycles
          recipeEdge.totalOutputPerMinute = produced
          this.propagateIngredientCalculations(recipe, callstack)
        }
      }
    })
  }

  private cycleToMinute(site: CraftingSiteNode, amount: number): number {
    try {
      const cyclePerMinute = 60.0 / site.recipe.manufacturingDuration

      return amount * cyclePerMinute
    } catch (error) {
      console.warn(site.type, site.id, 'error')
      return -1
    }

  }

  private minuteToCycle(site: CraftingSiteNode, amount: number): number {
    try {
      const cyclePerMinute = 60.0 / site.recipe.manufacturingDuration

      return amount / cyclePerMinute
    } catch (error) {
      console.warn(site.type, site.id, 'error')
      return -1
    }
  }

  private getOutgoingEdge(node: GraphFactoryNodeFactoryEdgeNodesInner): GraphEdge[] {
    return this.edges.filter(edge => edge.source === node.id)
  }

  private getIncomingEdges(node: GraphFactoryNodeFactoryEdgeNodesInner): GraphEdge[] {
    return this.edges.filter(edge => edge.target === node.id)
  }

  private isNodeExisting(node: GraphFactoryNodeFactoryEdgeNodesInner): boolean {
    return this.nodes.some(e => e.id === node.id)
  }

  private isEdgeExisting(edge: FactoryEdge): boolean {
    return this.edges.some(e => e.source === edge.source && e.target === edge.target)
  }

  getItemNodes(): ItemSiteNodeImpl[] {
    return this.nodes.filter(e => e instanceof ItemSiteNodeImpl)
  }
}
