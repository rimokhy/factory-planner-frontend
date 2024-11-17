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
import { ItemDescriptorDto } from './item-descriptor-dto';


export interface ExtractorDto { 
    className: string;
    displayName: string;
    description: string;
    extractCycleTime: number;
    itemsPerCycle: number;
    powerConsumption: number;
    powerConsumptionExponent: number;
    minPotential: number;
    maxPotential: number;
    productionBoost: number;
    extractorType: string;
    descriptor: ItemDescriptorDto;
}
