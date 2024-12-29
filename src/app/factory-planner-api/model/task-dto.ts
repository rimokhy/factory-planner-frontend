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
import { TaskIoDto } from './task-io-dto';


export interface TaskDto { 
    type: TaskDto.TypeEnum;
    status: TaskDto.StatusEnum;
    ingoing: Array<TaskIoDto>;
    outgoing: Array<TaskIoDto>;
    id: string;
}
export namespace TaskDto {
    export type TypeEnum = 'CraftingSite' | 'ExtractingSite' | 'PowerGeneratingSite';
    export const TypeEnum = {
        CraftingSite: 'CraftingSite' as TypeEnum,
        ExtractingSite: 'ExtractingSite' as TypeEnum,
        PowerGeneratingSite: 'PowerGeneratingSite' as TypeEnum
    };
    export type StatusEnum = 'ToDo' | 'InProgress' | 'Disconnected' | 'Done';
    export const StatusEnum = {
        ToDo: 'ToDo' as StatusEnum,
        InProgress: 'InProgress' as StatusEnum,
        Disconnected: 'Disconnected' as StatusEnum,
        Done: 'Done' as StatusEnum
    };
}


