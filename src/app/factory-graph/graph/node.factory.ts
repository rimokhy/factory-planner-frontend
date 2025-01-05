import {ExtractorDto, FactoryNode, ItemDescriptorDto, RecipeDto} from "../../factory-planner-api";
import {CraftingSiteNodeImpl} from "./crafting-site.node";
import {ExtractingSiteNodeImpl} from "./extracting-site.node";
import {ItemSiteNodeImpl} from "./item-site.node";
import {Node} from "@swimlane/ngx-graph";
import {ExtractionNode, Purity, PurityModifier} from "../../extraction-config/extraction-config.component";

export const isItemSiteNode = (site?: Node & { type?: FactoryNode.TypeEnum }): site is ItemSiteNodeImpl => {
  return site?.type === FactoryNode.TypeEnum.ItemSite
}

export const isExtractingSiteNode = (site?: Node & { type?: FactoryNode.TypeEnum }): site is ExtractingSiteNodeImpl => {
  return site?.type === FactoryNode.TypeEnum.ExtractorSite
}

export const isExtractionNode = (site?: Node & { type?: FactoryNode.TypeEnum }): site is ExtractionNode & Node => {
  return site?.type === FactoryNode.TypeEnum.ExtractionNode
}

export const isCraftingSiteNode = (site?: Node & { type?: FactoryNode.TypeEnum }): site is CraftingSiteNodeImpl => {
  return site?.type === FactoryNode.TypeEnum.CraftingSite
}

export const createNode = (node: Node): FactoryNode => {
  if (isCraftingSiteNode(node)) {
    return new CraftingSiteNodeImpl(node.recipe, node.automaton, node.factorySiteTarget, node.label, node.id)
  }

  if (isExtractingSiteNode(node)) {
    return new ExtractingSiteNodeImpl(
      node.automaton,
      node.factorySiteTarget,
      node.label,
      node.id
    )
  }

  if (isItemSiteNode(node)) {
    return new ItemSiteNodeImpl(
      node.factorySiteTarget,
      node.label,
      node.id
    )
  }

  throw new Error('Unknown node')
}

export const calculateExtractingSpeed = (extractor: ExtractorDto, extractedItem: ItemDescriptorDto, purity: Purity, overclockPercentage: number): number => {
  if (overclockPercentage <= 0 && overclockPercentage > 250) {
    throw new Error('Invalid overclock setting')
  }
  const cyclePerMinute = 60 / extractor.extractCycleTime
  const itemsPerCycle = extractedItem.form === 'RF_LIQUID' ? extractor.itemsPerCycle / 1000 : extractor.itemsPerCycle
  const itemPerMinute = itemsPerCycle * cyclePerMinute

  return (PurityModifier[purity] * overclockPercentage) / 100 * itemPerMinute
};

export interface SealedRequirement {
  item: ItemDescriptorDto;
  manufacturing?: RecipeDto | ExtractorDto;
  requiredAmount: number;
}
