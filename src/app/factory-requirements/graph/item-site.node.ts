import {
  CraftingMachineDto,
  CraftingSiteNode,
  FactoryNode,
  ItemDescriptorDto, ItemSiteNode,
  RecipeDto
} from "../../factory-planner-api";
import {sum} from "lodash";

export class ItemSiteNodeImpl implements ItemSiteNode {
  type = FactoryNode.TypeEnum.ItemSite;

  constructor(
    readonly factorySiteTarget: ItemDescriptorDto,
    readonly label: string,
    readonly id: string
  ) {
  }
}
