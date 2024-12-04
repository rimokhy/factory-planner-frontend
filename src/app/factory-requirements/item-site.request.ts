import {CraftingSiteRequest, ExtractingSiteRequest, FactorySiteRequest, ItemSiteRequest} from "../factory-planner-api";
import {SealedRequirement} from "./graph/node.factory";
import {isNil} from "lodash";
import {isExtractor, isRecipe} from "./factory-requirements.component";

export const makeFactorySiteRequest = (requirement: SealedRequirement): FactorySiteRequest => {
  if (isNil(requirement.manufacturing)) {
    return makeItemSiteRequest(requirement.item.className);
  }
  if (isRecipe(requirement.manufacturing)) {
    return makeCraftingSiteRequest(requirement.item.className, requirement.manufacturing.className);
  }
  if (isExtractor(requirement.manufacturing)) {
    return makeExtractingSiteRequest(requirement.item.className, requirement.manufacturing.className)
  }

  console.error('Unhandled req', requirement);
  throw new Error('Unhandled req');
}

export const makeItemSiteRequest = (itemClass: string): ItemSiteRequest => {
  return {
    type: FactorySiteRequest.TypeEnum.ItemSite,
    itemClass: itemClass,
  }
}

export const makeCraftingSiteRequest = (itemClass: string, recipeClass: string): CraftingSiteRequest => {
  return {
    type: FactorySiteRequest.TypeEnum.CraftingSite,
    itemClass: itemClass,
    recipeClass: recipeClass,
  }
}

export const  makeExtractingSiteRequest = (itemClass: string, extractorClass: string): ExtractingSiteRequest => {
  return {
    type: FactorySiteRequest.TypeEnum.ExtractorSite,
    itemClass: itemClass,
    extractorClass: extractorClass,
  }
}
