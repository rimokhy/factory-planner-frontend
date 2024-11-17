import {
  CraftingSiteNode,
  ExtractingSiteNode,
  FactoryEdge,
  FactoryNode,
  GraphBuilderFactoryNodeFactoryEdge,
  GraphBuilderFactoryNodeFactoryEdgeNodesInner,
  ItemSiteNode
} from "../../factory-planner-api";
import {ClusterNode, Edge, Node} from "@swimlane/ngx-graph";
import {isEmpty, isNil, max, partition, sum} from "lodash";
import {FactoryRequirementsComponent} from "../../factory-requirements/factory-requirements.component";
import {Subject} from "rxjs";

export type GraphNode = Node & GraphBuilderFactoryNodeFactoryEdgeNodesInner;
export type GraphEdge = Edge & FactoryEdge;


export class GraphNavigator {
  nodes: GraphNode[] = [];
  edges: GraphEdge[] = [];
  clusters: ClusterNode[] = [];
  requirements?: FactoryRequirementsComponent

  constructor(private readonly updateGraphSubject: Subject<boolean>) {

  }

  async populate({nodes, edges}: GraphBuilderFactoryNodeFactoryEdge) {
    nodes.forEach((node: GraphNode) => {
      if (!this.isNodeExisting(node)) {
        this.nodes.push(node);
      }
    })

    edges.forEach(edge => {
      if (!this.isEdgeExisting(edge)) {
        this.edges.push(edge);
      }
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

  getItemSiteRequiredAmount(site: ItemSiteNode): number {
    const outgoing = this.getOutgoingEdge(site).map(edge => edge.outputPerCycle).filter(e => !isNil(e))

    return sum(outgoing)
  }

  computeSiteItemRequiredAmount(site: ItemSiteNode): number {
    const initialValue = this.isRequirement(site) ? this.getRequiredTotal(site.factorySiteTarget.className) : 0
    const outgoing = this.getOutgoingEdge(site)
    const ingoing = this.getIncomingEdges(site)

    if (!this.isRequirement(site) && isEmpty(outgoing) && !isEmpty(ingoing)) {

      return sum(ingoing.map(e => this.computeLink(e)))
    }

    return sum(outgoing.map(e => this.computeLink(e))) + initialValue
  }

  getRequiredTotal(className: string): number {
    const requirements = this.requirements?.requiredFactoryItems.filter(e => !isNil(e.item.value) && e.item.value.className === className)

    return sum(requirements?.map(edge => {
      return edge.requiredAmount.value;
    }));
  }

  computeRecipeRequiredMachines(site: CraftingSiteNode): number {
    const selfEdges = this.getOutgoingEdge(site).filter(edge => edge.source === site.id)
    const products = this.nodes.filter(node => selfEdges.map(edge => edge.target).includes(node.id) && this.isItemSiteNode(node))
    const machinesRequiredPerProduction = products.map(product => {
      const totalPerCycle = this.minuteToCycle(site, this.getRequiredTotal(product.factorySiteTarget.className)) + this.getItemSiteRequiredAmount(product)
      const correspondingEdge = selfEdges.find(edge => edge.source === site.id && edge.target === product.id)

      return totalPerCycle / correspondingEdge?.outputPerCycle!!
    })

    return max(machinesRequiredPerProduction) || 0
  }

  computeLink(edge: FactoryEdge): number | undefined {
    const source = this.nodes.find(e => e.id === edge.source)
    const target = this.nodes.find(e => e.id === edge.target)

    if (this.isItemSiteNode(source) && this.isCraftingSiteNode(target)) {
      const requiredMachine = this.computeRecipeRequiredMachines(target)

      return this.cycleToMinute(target, edge.outputPerCycle!! * requiredMachine!!)
    }
    if (this.isCraftingSiteNode(source) && this.isItemSiteNode(target)) {
      const requiredMachine = this.computeRecipeRequiredMachines(source)

      return this.cycleToMinute(source, requiredMachine!! * edge.outputPerCycle!!)
    }
    return undefined
  }

  displayNumber(nb: number | undefined): string {
    if (isNil(nb)) {
      return ''
    }
    return Number(nb).toFixed(3)
  }

  isSourceCraftingSite(link: FactoryEdge): boolean {
    const source = this.nodes.filter(e => e.id === link.source)

    return source.every(node => this.isCraftingSiteNode(node))
  }


  isItemSiteNode(site?: GraphNode): site is ItemSiteNode {
    return site?.type === FactoryNode.TypeEnum.ItemSite
  }

  isExtractingSiteNode(site?: GraphNode): site is ExtractingSiteNode {
    return site?.type === FactoryNode.TypeEnum.ExtractorSite
  }

  isCraftingSiteNode(site?: GraphNode): site is CraftingSiteNode {
    return site?.type === FactoryNode.TypeEnum.CraftingSite
  }

  private disconnectSite(node: GraphNode) {
    // TODO remove parent site if useless
    const outgoing = this.getOutgoingEdge(node).map(edge => {

      return edge.id;
    });
    const ingoing = this.getIncomingEdges(node).map(edge => edge.id);

    this.edges = this.edges.filter(edge => !outgoing.includes(edge.id) && !ingoing.includes(edge.id));
  }

  private updateGraph() {
    const [remaining, rest] = partition(this.nodes, node => {
      if (this.isRequirement(node)) {
        return true
      }

      if (this.isItemSiteNode(node)) {
        return this.computeSiteItemRequiredAmount(node) > 0.0
      }
      if (this.isCraftingSiteNode(node)) {
        return this.computeRecipeRequiredMachines(node) > 0.0
      }

      console.log('skipped', node)
      // TODO see for extracting site

      return true
    })
    rest.forEach(e => {
      this.disconnectSite(e)
    })
    this.nodes = remaining
    this.updateGraphSubject.next(true)
  }

  private isRequirement(node: GraphNode): boolean {
    if (!this.requirements) {
      return true
    }
    return this.requirements.requiredFactoryItems.some(requirement => requirement.item.value?.className === node.id)
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

  private getOutgoingEdge(node: GraphNode): GraphEdge[] {
    return this.edges.filter(edge => edge.source === node.id)
  }

  private getIncomingEdges(node: GraphNode): GraphEdge[] {
    return this.edges.filter(edge => edge.target === node.id)
  }

  private isNodeExisting(node: GraphNode): boolean {
    return this.nodes.some(e => e.id === node.id)
  }

  private isEdgeExisting(edge: FactoryEdge): boolean {
    return this.edges.some(e => e.source === edge.source && e.target === edge.target)
  }
}
