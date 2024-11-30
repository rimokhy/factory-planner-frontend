import {
  CraftingMachineDto,
  CraftingSiteNode,
  FactoryNode,
  ItemDescriptorDto, ItemSiteNode,
  RecipeDto
} from "../../factory-planner-api";

export class ItemSiteNodeImpl implements ItemSiteNode {
  type = FactoryNode.TypeEnum.ItemSite;
  requiredAmountPerMinute = 0

  constructor(
    readonly factorySiteTarget: ItemDescriptorDto,
    readonly label: string,
    readonly id: string
  ) {
  }

  add(amount: number) {
    this.requiredAmountPerMinute += amount;
  }
}
