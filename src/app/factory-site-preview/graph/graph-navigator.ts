import {
  CraftingSiteNode,
  ExtractingSiteNode,
  FactoryEdge,
  GraphBuilderFactoryNodeFactoryEdge,
  GraphBuilderFactoryNodeFactoryEdgeNodesInner
} from "../../factory-planner-api";
import {ClusterNode, Edge, Node} from "@swimlane/ngx-graph";
import {isEmpty, isNil, max, partition, sum} from "lodash";
import {FactoryRequirementsComponent} from "../../factory-requirements/factory-requirements.component";
import {Subject} from "rxjs";
import {createNode, isCraftingSiteNode, isItemSiteNode} from "./node.factory";
import {CraftingSiteNodeImpl} from "./crafting-site.node";
import {ItemSiteNodeImpl} from "./item-site.node";
import {ExtractingSiteNodeImpl} from "./extracting-site.node";


export type GraphNode = Node & (CraftingSiteNodeImpl) | ExtractingSiteNodeImpl | ItemSiteNodeImpl;
export type GraphEdge = Edge & FactoryEdge;


export class GraphNavigator {
  nodes: GraphNode[] = [];
  edges: GraphEdge[] = [];
  clusters: ClusterNode[] = [];
  requirements?: FactoryRequirementsComponent

  constructor(private readonly updateGraphSubject: Subject<boolean>) {

  }

  async populate({nodes, edges}: GraphBuilderFactoryNodeFactoryEdge) {
    nodes.forEach((node: GraphBuilderFactoryNodeFactoryEdgeNodesInner) => {
      if (!this.isNodeExisting(node)) {
        this.nodes.push(createNode(node) as GraphNode);
      }
    })

    edges.forEach(edge => {
      const existing = this.edges.find(e => e.source === edge.source && e.target === edge.target)
      if (!existing) {
        this.edges.push(edge);
      }
    })


    this.actualizeGraph()
    this.updateGraphSubject.next(true)
  }

  selectSite(node: CraftingSiteNode | ExtractingSiteNode) {
    const outgoing = this.getOutgoingEdge(node)

    outgoing.forEach(edge => {
      const destination = this.nodes.find(e => e.id === edge.target)

      if (destination) {
        const targetIncoming = this.getIncomingEdges(destination).filter(edge => edge.source !== node.id)

        targetIncoming.forEach(targetEdge => {
          const source = this.nodes.find(e => e.id === targetEdge.source)

          if (source) {
            this.removeSite(source)
          }
        })
      }

    })

    this.flushGraph()
  }

  removeSite(node: GraphNode) {
    // TODO remove parent site if useless
    this.disconnectSite(node)
    this.flushGraph()
  }

  getRequiredTotal(className: string): number {
    const requirements = this.requirements?.requiredFactoryItems.filter(e => !isNil(e.item.value) && e.item.value.className === className)

    return sum(requirements?.map(edge => {
      return edge.requiredAmount.value;
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
    return this.getTotalItemProducedItems(node);
  }

  private disconnectSite(node: GraphNode) {
    const connections = [
      ...this.getOutgoingEdge(node),
      ...this.getIncomingEdges(node)
    ].map(e => e.id);

    this.edges = this.edges.filter(edge => !connections.includes(edge.id));
  }

  private computeRecipeRequiredMachines(recipe: CraftingSiteNodeImpl, productItem: ItemSiteNodeImpl, amountPerCycle: number): number {
    const recipeToItem = this.getOutgoingEdge(recipe).find(e => e.target === productItem?.id && e.source === recipe.id);

    return amountPerCycle / recipeToItem?.outputPerCycle!!
  }

  private computeRecipe(recipe: CraftingSiteNodeImpl, productItem: ItemSiteNodeImpl, requiredTotal: number, recipeToItemEdge: FactoryEdge, callstack: {
    recipe: string,
    requiredTotal: number
  }[] = []) {
    if (callstack.some(e => e.recipe === recipe.id && this.isEqualsFixed(requiredTotal, e.requiredTotal))) {
      return
    }
    callstack.push({recipe: recipe.id, requiredTotal: requiredTotal})

    const requiredTotalPerCycle = this.minuteToCycle(recipe, requiredTotal)
    const requiredCycle = this.computeRecipeRequiredMachines(recipe, productItem, requiredTotalPerCycle)

    recipe.requiredMachines = requiredCycle
    recipeToItemEdge.totalOutputPerMinute = this.cycleToMinute(recipe, recipeToItemEdge.outputPerCycle!! * requiredCycle)

    const ingredients = this.getIncomingEdges(recipe)

    for (const edge of ingredients) {
      const newTotalOutputPerCycle = requiredCycle * edge.outputPerCycle!!
      const ingredient = this.nodes.find(e => e.id === edge.source)

      if (ingredient && ingredient instanceof ItemSiteNodeImpl) {
        const ingredientTotal = this.cycleToMinute(recipe, newTotalOutputPerCycle) + this.getRequiredTotal(ingredient.factorySiteTarget.className)

        this.computeItemRequirement(ingredient, ingredientTotal, callstack)
      }
    }

  }

  private isEqualsFixed(nb: number, nb1: number): boolean {
    const fixedNb = Number(nb).toFixed(5);
    const fixedNb1 = Number(nb1).toFixed(5);

    return fixedNb === fixedNb1
  }

  private computeItemRequirement(item: ItemSiteNodeImpl, requiredTotalPerMinute: number, callstack: {
    recipe: string,
    requiredTotal: number
  }[] = []) {
    const recipes = this.getIncomingEdges(item)

    recipes.forEach(recipeEdge => {
      const recipe = this.nodes.find(recipeNode => recipeNode.id === recipeEdge.source)

      if (recipe instanceof CraftingSiteNodeImpl) this.computeRecipe(recipe, item, requiredTotalPerMinute, recipeEdge, callstack)
    })
  }

  private actualizeGraph() {
    this.edges.forEach(edge => {
      edge.totalOutputPerMinute = 0
    })
    this.nodes
      .filter(item => this.isRequirement(item))
      .filter(item => item instanceof ItemSiteNodeImpl)
      .forEach((item) => {
        // Get item requirements from user

        this.computeItemRequirement(item, this.getRequiredTotal(item.factorySiteTarget.className))
      })
    this.edges.forEach(edge => {
      const actual = this.computeLink(edge)

      if (actual !== undefined) {
        edge.totalOutputPerMinute = actual
      }
    })
    this.nodes.filter(item => item instanceof ItemSiteNodeImpl)
      .forEach(item => {
        const requirements = this.getTotalItemRequiredItems(item)
        const produced = this.getTotalItemProducedItems(item)

        if (produced < requirements) {
          const recipes = this.getIncomingEdges(item)

          recipes.forEach(recipeEdge => {
            const recipe = this.nodes.find(recipeNode => recipeNode.id === recipeEdge.source) as CraftingSiteNodeImpl
            this.computeRecipe(recipe, item, requirements, recipeEdge)
          })
        }
        console.log(item.id, requirements, produced)
      })
    this.edges.forEach(edge => {
      const actual = this.computeLink(edge)

      if (actual !== undefined) {
        edge.totalOutputPerMinute = actual
      }
    })
  }

  private flushGraph() {
    const [remaining, rest] = partition(this.nodes, node => {
      if (this.isRequirement(node)) {
        return true
      }
      if (isEmpty(this.getOutgoingEdge(node)) && isEmpty(this.getIncomingEdges(node))) {
        return false
      }


      // TODO see for extracting site

      return true
    })

    rest.forEach(e => {
      this.disconnectSite(e)
    })
    this.nodes = remaining
    this.actualizeGraph()
  }

  private isRequirement(node: GraphNode | string): boolean {
    if (!this.requirements) {
      return true
    }
    const nodeId = (typeof node === 'string') ? node : node.id

    return this.requirements.requiredFactoryItems.some(requirement => requirement.item.value?.className === nodeId)
  }

  private cycleToMinute(site: CraftingSiteNode, amount: number): number {
    try {
      const cyclePerMinute = 60.0 / site.recipe.manufacturingDuration

      return amount * cyclePerMinute
    } catch (error) {
      console.log(site.type, site.id, 'error')
      return -1
    }

  }

  private minuteToCycle(site: CraftingSiteNode, amount: number): number {
    try {
      const cyclePerMinute = 60.0 / site.recipe.manufacturingDuration

      return amount / cyclePerMinute
    } catch (error) {
      console.log(site.type, site.id, 'error')
      return -1
    }
  }

  private getOutgoingEdge(node: GraphBuilderFactoryNodeFactoryEdgeNodesInner): GraphEdge[] {
    return this.edges.filter(edge => edge.source === node.id)
  }

  private getIncomingEdges(node: GraphBuilderFactoryNodeFactoryEdgeNodesInner): GraphEdge[] {
    return this.edges.filter(edge => edge.target === node.id)
  }

  private isNodeExisting(node: GraphBuilderFactoryNodeFactoryEdgeNodesInner): boolean {
    return this.nodes.some(e => e.id === node.id)
  }

  private isEdgeExisting(edge: FactoryEdge): boolean {
    return this.edges.some(e => e.source === edge.source && e.target === edge.target)
  }

}
