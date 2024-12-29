/**
 * OpenAPI definition
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { RecipeDto } from './recipe-dto';
import { TaskIoDto } from './task-io-dto';
import { TaskDto } from './task-dto';


export interface CraftingSiteTaskDto extends TaskDto { 
    requiredCycles: number;
    recipe: RecipeDto;
    overclockingProfile: number;
}
export namespace CraftingSiteTaskDto {
}


