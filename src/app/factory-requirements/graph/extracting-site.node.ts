import {ExtractingSiteNode, ExtractorDto, FactoryNode, ItemDescriptorDto} from "../../factory-planner-api";

export class ExtractingSiteNodeImpl implements ExtractingSiteNode {
  type = FactoryNode.TypeEnum.ExtractorSite;

  constructor(
    readonly automaton: ExtractorDto,
    readonly factorySiteTarget: ItemDescriptorDto,
    readonly label: string,
    readonly id: string
  ) {
  }
}
