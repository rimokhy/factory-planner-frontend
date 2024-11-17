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
import { AssetsBucketEntry } from './assets-bucket-entry';
import { ExtractorDto } from './extractor-dto';


export interface ItemDescriptorDto { 
    className: string;
    displayName: string;
    form: string;
    sinkablePoints?: number;
    category: ItemDescriptorDto.CategoryEnum;
    extractedIn: Set<ExtractorDto>;
    icon: AssetsBucketEntry;
}
export namespace ItemDescriptorDto {
    export type CategoryEnum = 'Raw' | 'Biomass' | 'Building' | 'Equipment' | 'Craftable' | 'Vehicle' | 'Consumable' | 'PowerShard';
    export const CategoryEnum = {
        Raw: 'Raw' as CategoryEnum,
        Biomass: 'Biomass' as CategoryEnum,
        Building: 'Building' as CategoryEnum,
        Equipment: 'Equipment' as CategoryEnum,
        Craftable: 'Craftable' as CategoryEnum,
        Vehicle: 'Vehicle' as CategoryEnum,
        Consumable: 'Consumable' as CategoryEnum,
        PowerShard: 'PowerShard' as CategoryEnum
    };
}


