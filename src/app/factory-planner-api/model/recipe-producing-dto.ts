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
import { RecipeIoDto } from './recipe-io-dto';
import { CraftingMachineDto } from './crafting-machine-dto';


export interface RecipeProducingDto { 
    className: string;
    manufacturingDuration: number;
    displayName: string;
    manufacturedIn: Array<CraftingMachineDto>;
    producing: Array<RecipeIoDto>;
    manufacturingDurationByMinute: number;
}

