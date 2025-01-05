import {
  CraftingMachineDto,
  CraftingSiteNode,
  FactoryNode,
  ItemDescriptorDto,
  RecipeDto
} from "../../factory-planner-api";

export class CraftingSiteNodeImpl implements CraftingSiteNode {
  type = FactoryNode.TypeEnum.CraftingSite;
  requiredMachines = 0

  constructor(
    readonly recipe: RecipeDto,
    readonly automaton: CraftingMachineDto,
    readonly factorySiteTarget: ItemDescriptorDto,
    readonly label: string,
    readonly id: string
  ) {
  }
}
