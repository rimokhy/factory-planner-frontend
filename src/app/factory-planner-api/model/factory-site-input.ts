/**
 * OpenAPI definition
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { ItemDescriptorSummary } from './item-descriptor-summary';
import { FactoryPlanningRequest } from './factory-planning-request';


export interface FactorySiteInput { 
    type: FactorySiteInput.TypeEnum;
    item: ItemDescriptorSummary;
    amountPerCycle: number;
    ingredients: Array<FactoryPlanningRequest>;
}
export namespace FactorySiteInput {
    export type TypeEnum = 'ExtractorSite' | 'RecipeSite';
    export const TypeEnum = {
        ExtractorSite: 'ExtractorSite' as TypeEnum,
        RecipeSite: 'RecipeSite' as TypeEnum
    };
}


