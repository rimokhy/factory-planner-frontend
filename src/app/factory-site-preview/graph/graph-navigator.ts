import {
  CraftingSiteNode,
  ExtractingSiteNode,
  FactoryEdge,
  GraphBuilderFactoryNodeFactoryEdge,
  GraphBuilderFactoryNodeFactoryEdgeNodesInner
} from "../../factory-planner-api";
import {ClusterNode, Edge, Node} from "@swimlane/ngx-graph";
import {isNil, max, partition, sum} from "lodash";
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
      if (!this.isEdgeExisting(edge)) {
        this.edges.push(edge);
      }
    })
    this.nodes
      .filter(item => this.isRequirement(item))
      .forEach((item) => {
        if (!(item instanceof ItemSiteNodeImpl)) {
          throw new Error('Not item site isntance')
        }
        // Set item requirements from user
        item.requiredAmountPerMinute = this.getRequiredTotal(item.factorySiteTarget.className)
      })
    this.computeRecipeIngredients()
    this.nodes
      .filter(item => item instanceof ItemSiteNodeImpl)
      .forEach((item) => {
        if (!(item instanceof ItemSiteNodeImpl)) {
          throw new Error('Not item site isntance')
        }
        // Calculate requirements from graph
        console.log('adding req', item.id, this.getOutgoingEdge(item).map(e => e.totalOutputPerCycle))
        item.requiredAmountPerMinute += sum(this.getOutgoingEdge(item).map(e => e.totalOutputPerMinute))
      })
    this.updateGraph()
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

    this.updateGraph()
  }

  removeSite(node: GraphNode) {
    // TODO remove parent site if useless
    this.disconnectSite(node)
    this.updateGraph()
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
      return this.cycleToMinute(target, edge.totalOutputPerCycle!!)
    }
    if (isCraftingSiteNode(source) && isItemSiteNode(target)) {
      return this.cycleToMinute(source, edge.totalOutputPerCycle!!)
    }
    return undefined
  }

  displayNumber(nb: number | undefined): string {
    if (isNil(nb)) {
      return ''
    }
    return Number(nb).toFixed(3)
  }

  private disconnectSite(node: GraphNode) {
    const outgoing = this.getOutgoingEdge(node).map(edge => {

      return edge.id;
    });
    const ingoing = this.getIncomingEdges(node).map(edge => edge.id);

    this.edges = this.edges.filter(edge => !outgoing.includes(edge.id) && !ingoing.includes(edge.id));
  }

  private computeRecipeIngredients() {
    this.nodes.filter(e => e instanceof CraftingSiteNodeImpl).forEach(recipe => {
      // Calculate required machines for user requirements
      const products = this.getOutgoingEdge(recipe).map(edge => this.nodes.find(e => e.id === edge.target)).filter(e => !isNil(e));
      const requiredMachinePerProduct = products.map(productItem => {
        const req = (productItem as ItemSiteNodeImpl).requiredAmountPerMinute;
        const recipeToItem = this.getOutgoingEdge(recipe).find(e => e.target === productItem?.id && e.source === recipe.id);

        return this.minuteToCycle(recipe, req) / recipeToItem?.outputPerCycle!!
      })

      recipe.requiredMachines = max(requiredMachinePerProduct) || 0

      // Set edges requirements per ingredients
      this.getIncomingEdges(recipe).map(edge => {
        if (edge.totalOutputPerCycle === undefined) {
          edge.totalOutputPerCycle = 0
        }
        edge.totalOutputPerCycle = recipe.requiredMachines * edge.outputPerCycle!!
        edge.totalOutputPerMinute = this.cycleToMinute(recipe, edge.totalOutputPerCycle)
      })

      // Set edges requirements per product item
      this.getOutgoingEdge(recipe).map(edge => {
        if (edge.totalOutputPerCycle === undefined) {
          edge.totalOutputPerCycle = 0
        }
        edge.totalOutputPerCycle = recipe.requiredMachines * edge.outputPerCycle!!
        edge.totalOutputPerMinute = this.cycleToMinute(recipe, edge.totalOutputPerCycle)
      })
    })
  }

  private updateGraph() {
    const [remaining, rest] = partition(this.nodes, node => {
      if (this.isRequirement(node)) {
        return true
      }
      /*
            if (this.isItemSiteNode(node)) {
              return this.computeSiteItemRequiredAmount(node) > 0.0
            }
            if (this.isCraftingSiteNode(node)) {
              return this.computeRecipeRequiredMachines(node) > 0.0
            }
      */

      // TODO see for extracting site

      return true
    })

    rest.forEach(e => {
      this.disconnectSite(e)
    })
    this.nodes = remaining
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
