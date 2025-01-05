import {SealedRequirement} from "../node.factory";

// http://192.168.1.61:4200/factory-planning?factoryRequirement=%7B%22itemClass%22:%22Desc_IronPlate_C%22,%22requiredAmount%22:300,%22recipeClass%22:%22Recipe_IronPlate_C%22%7D&factoryRequirement=%7B%22itemClass%22:%22Desc_IronRod_C%22,%22requiredAmount%22:300,%22recipeClass%22:%22Recipe_IronRod_C%22%7D&factoryRequirement=%7B%22itemClass%22:%22Desc_IronIngot_C%22,%22requiredAmount%22:0,%22recipeClass%22:%22Recipe_IngotIron_C%22%7D
export const ROD_300_AND_300_PLATE = {
  name: 'ROD_300_AND_300_PLATE',
  requirements: [
    {
      "item": {
        "className": "Desc_IronPlate_C",
        "displayName": "Iron Plate",
        "form": "RF_SOLID",
        "sinkablePoints": 6,
        "category": "Craftable",
        "extractedIn": [],
        "icon": {
          "objectPath": "FactoryGame/Content/FactoryGame/Resource/Parts/IronPlate/UI/IconDesc_IronPlates_256.png",
          "link": "http://51.178.82.124:9000/assets/FactoryGame/Content/FactoryGame/Resource/Parts/IronPlate/UI/IconDesc_IronPlates_256.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=cYuJwwEItp7cP7Z29mBX%2F20241203%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241203T231557Z&X-Amz-Expires=172800&X-Amz-SignedHeaders=host&X-Amz-Signature=509859311526b59e3ae7ab62ec2f1e44655e0f33cb3083aafe4d6a72b8c38167"
        }
      },
      "manufacturing": {
        "className": "Recipe_IronPlate_C",
        "manufacturingDuration": 6,
        "displayName": "Iron Plate",
        "manufacturedIn": [
          {
            "className": "Build_ConstructorMk1_C",
            "displayName": "Constructor",
            "description": "Crafts 1 part into another part.\r\n\r\nCan be automated by feeding component parts in via a Conveyor Belt connected to the input port. The resulting parts can be automatically extracted by connecting a Conveyor Belt to the output port.",
            "manufacturingSpeed": 1,
            "powerConsumption": 4,
            "powerConsumptionExponent": 1.321929,
            "minPotential": 0.01,
            "maxPotential": 1,
            "productionBoost": 1,
            "descriptor": {
              "className": "Desc_ConstructorMk1_C",
              "displayName": "ConstructorMk1",
              "form": "RF_INVALID",
              "sinkablePoints": null,
              "category": "Building",
              "extractedIn": [],
              "icon": {
                "objectPath": "FactoryGame/Content/FactoryGame/Buildable/Factory/ConstructorMk1/UI/IconDesc_ConstructorMk1_512.png",
                "link": "http://51.178.82.124:9000/assets/FactoryGame/Content/FactoryGame/Buildable/Factory/ConstructorMk1/UI/IconDesc_ConstructorMk1_512.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=cYuJwwEItp7cP7Z29mBX%2F20241203%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241203T231557Z&X-Amz-Expires=172800&X-Amz-SignedHeaders=host&X-Amz-Signature=03de519c126f242e046f53b4fa2a85bda91d2a5ad384e9916d4d327a779509cc"
              }
            }
          }
        ],
        "producing": [
          {
            "item": {
              "className": "Desc_IronPlate_C",
              "displayName": "Iron Plate",
              "form": "RF_SOLID",
              "sinkablePoints": 6,
              "category": "Craftable",
              "extractedIn": [],
              "icon": {
                "objectPath": "FactoryGame/Content/FactoryGame/Resource/Parts/IronPlate/UI/IconDesc_IronPlates_256.png",
                "link": "http://51.178.82.124:9000/assets/FactoryGame/Content/FactoryGame/Resource/Parts/IronPlate/UI/IconDesc_IronPlates_256.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=cYuJwwEItp7cP7Z29mBX%2F20241203%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241203T231557Z&X-Amz-Expires=172800&X-Amz-SignedHeaders=host&X-Amz-Signature=509859311526b59e3ae7ab62ec2f1e44655e0f33cb3083aafe4d6a72b8c38167"
              }
            },
            "outputPerCycle": 2,
            "actualOutputPerCycle": 2
          }
        ],
        "manufacturingDurationByMinute": 10
      },
      "requiredAmount": 300
    },
    {
      "item": {
        "className": "Desc_IronRod_C",
        "displayName": "Iron Rod",
        "form": "RF_SOLID",
        "sinkablePoints": 4,
        "category": "Craftable",
        "extractedIn": [],
        "icon": {
          "objectPath": "FactoryGame/Content/FactoryGame/Resource/Parts/IronRod/UI/IconDesc_IronRods_256.png",
          "link": "http://51.178.82.124:9000/assets/FactoryGame/Content/FactoryGame/Resource/Parts/IronRod/UI/IconDesc_IronRods_256.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=cYuJwwEItp7cP7Z29mBX%2F20241203%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241203T231557Z&X-Amz-Expires=172800&X-Amz-SignedHeaders=host&X-Amz-Signature=acf43aa132182228ad91575042d65b2bc4e8880d472d8e4f286e07e6716d5207"
        }
      },
      "manufacturing": {
        "className": "Recipe_IronRod_C",
        "manufacturingDuration": 4,
        "displayName": "Iron Rod",
        "manufacturedIn": [
          {
            "className": "Build_ConstructorMk1_C",
            "displayName": "Constructor",
            "description": "Crafts 1 part into another part.\r\n\r\nCan be automated by feeding component parts in via a Conveyor Belt connected to the input port. The resulting parts can be automatically extracted by connecting a Conveyor Belt to the output port.",
            "manufacturingSpeed": 1,
            "powerConsumption": 4,
            "powerConsumptionExponent": 1.321929,
            "minPotential": 0.01,
            "maxPotential": 1,
            "productionBoost": 1,
            "descriptor": {
              "className": "Desc_ConstructorMk1_C",
              "displayName": "ConstructorMk1",
              "form": "RF_INVALID",
              "sinkablePoints": null,
              "category": "Building",
              "extractedIn": [],
              "icon": {
                "objectPath": "FactoryGame/Content/FactoryGame/Buildable/Factory/ConstructorMk1/UI/IconDesc_ConstructorMk1_512.png",
                "link": "http://51.178.82.124:9000/assets/FactoryGame/Content/FactoryGame/Buildable/Factory/ConstructorMk1/UI/IconDesc_ConstructorMk1_512.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=cYuJwwEItp7cP7Z29mBX%2F20241203%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241203T231557Z&X-Amz-Expires=172800&X-Amz-SignedHeaders=host&X-Amz-Signature=03de519c126f242e046f53b4fa2a85bda91d2a5ad384e9916d4d327a779509cc"
              }
            }
          }
        ],
        "producing": [
          {
            "item": {
              "className": "Desc_IronRod_C",
              "displayName": "Iron Rod",
              "form": "RF_SOLID",
              "sinkablePoints": 4,
              "category": "Craftable",
              "extractedIn": [],
              "icon": {
                "objectPath": "FactoryGame/Content/FactoryGame/Resource/Parts/IronRod/UI/IconDesc_IronRods_256.png",
                "link": "http://51.178.82.124:9000/assets/FactoryGame/Content/FactoryGame/Resource/Parts/IronRod/UI/IconDesc_IronRods_256.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=cYuJwwEItp7cP7Z29mBX%2F20241203%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241203T231557Z&X-Amz-Expires=172800&X-Amz-SignedHeaders=host&X-Amz-Signature=acf43aa132182228ad91575042d65b2bc4e8880d472d8e4f286e07e6716d5207"
              }
            },
            "outputPerCycle": 1,
            "actualOutputPerCycle": 1
          }
        ],
        "manufacturingDurationByMinute": 15
      },
      "requiredAmount": 300
    },
    {
      "item": {
        "className": "Desc_IronIngot_C",
        "displayName": "Iron Ingot",
        "form": "RF_SOLID",
        "sinkablePoints": 2,
        "category": "Craftable",
        "extractedIn": [],
        "icon": {
          "objectPath": "FactoryGame/Content/FactoryGame/Resource/Parts/IronIngot/UI/IconDesc_IronIngot_256.png",
          "link": "http://51.178.82.124:9000/assets/FactoryGame/Content/FactoryGame/Resource/Parts/IronIngot/UI/IconDesc_IronIngot_256.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=cYuJwwEItp7cP7Z29mBX%2F20241203%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241203T231557Z&X-Amz-Expires=172800&X-Amz-SignedHeaders=host&X-Amz-Signature=0bf491f15a559cfee147fc0b11fa6918f4e86e09f00556224c00f9b082690c00"
        }
      },
      "manufacturing": {
        "className": "Recipe_IngotIron_C",
        "manufacturingDuration": 2,
        "displayName": "Iron Ingot",
        "manufacturedIn": [
          {
            "className": "Build_SmelterMk1_C",
            "displayName": "Smelter",
            "description": "Smelts ore into ingots.\r\n\r\nCan be automated by feeding ore in via a Conveyor Belt connected to the input port. The resulting ingots can be automatically extracted by connecting a Conveyor Belt to the output port.",
            "manufacturingSpeed": 1,
            "powerConsumption": 4,
            "powerConsumptionExponent": 1.321929,
            "minPotential": 0.01,
            "maxPotential": 1,
            "productionBoost": 1,
            "descriptor": {
              "className": "Desc_SmelterMk1_C",
              "displayName": "SmelterMk1",
              "form": "RF_INVALID",
              "sinkablePoints": null,
              "category": "Building",
              "extractedIn": [],
              "icon": {
                "objectPath": "FactoryGame/Content/FactoryGame/Buildable/Factory/SmelterMk1/UI/IconDesc_SmelterMk1_512.png",
                "link": "http://51.178.82.124:9000/assets/FactoryGame/Content/FactoryGame/Buildable/Factory/SmelterMk1/UI/IconDesc_SmelterMk1_512.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=cYuJwwEItp7cP7Z29mBX%2F20241203%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241203T231557Z&X-Amz-Expires=172800&X-Amz-SignedHeaders=host&X-Amz-Signature=07f99f0e88ff79da6dfb42949a189774199327d5eeac996e535f19292646ae69"
              }
            }
          }
        ],
        "producing": [
          {
            "item": {
              "className": "Desc_IronIngot_C",
              "displayName": "Iron Ingot",
              "form": "RF_SOLID",
              "sinkablePoints": 2,
              "category": "Craftable",
              "extractedIn": [],
              "icon": {
                "objectPath": "FactoryGame/Content/FactoryGame/Resource/Parts/IronIngot/UI/IconDesc_IronIngot_256.png",
                "link": "http://51.178.82.124:9000/assets/FactoryGame/Content/FactoryGame/Resource/Parts/IronIngot/UI/IconDesc_IronIngot_256.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=cYuJwwEItp7cP7Z29mBX%2F20241203%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241203T231557Z&X-Amz-Expires=172800&X-Amz-SignedHeaders=host&X-Amz-Signature=0bf491f15a559cfee147fc0b11fa6918f4e86e09f00556224c00f9b082690c00"
              }
            },
            "outputPerCycle": 1,
            "actualOutputPerCycle": 1
          }
        ],
        "manufacturingDurationByMinute": 30
      },
      "requiredAmount": 0
    },
    {
      "item": {
        "className": "Desc_OreIron_C",
        "displayName": "Iron Ore",
        "form": "RF_SOLID",
        "sinkablePoints": 1,
        "category": "Raw",
        "extractedIn": [
          {
            "className": "Build_MinerMk3_C",
            "displayName": "Miner Mk.3",
            "description": "Extracts solid resources from the resource node it is built on. \r\nDefault extraction rate is 240 resources per minute. \r\nExtraction rate varies based on resource node purity. Outputs all extracted resources onto connected Conveyor Belts.",
            "extractCycleTime": 0.25,
            "itemsPerCycle": 1,
            "powerConsumption": 45,
            "powerConsumptionExponent": 1.321929,
            "minPotential": 0.01,
            "maxPotential": 1,
            "productionBoost": 1,
            "extractorType": "Miner",
            "descriptor": {
              "className": "Desc_MinerMk3_C",
              "displayName": "MinerMk3",
              "form": "RF_INVALID",
              "sinkablePoints": null,
              "category": "Building",
              "extractedIn": [],
              "icon": {
                "objectPath": "FactoryGame/Content/FactoryGame/Buildable/Factory/MinerMk3/UI/IconDesc_MinerMk3_512.png",
                "link": "http://51.178.82.124:9000/assets/FactoryGame/Content/FactoryGame/Buildable/Factory/MinerMk3/UI/IconDesc_MinerMk3_512.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=cYuJwwEItp7cP7Z29mBX%2F20241203%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241203T231557Z&X-Amz-Expires=172800&X-Amz-SignedHeaders=host&X-Amz-Signature=41576999bd8570dac6a213b3d4f3be5b845a75927e7ce8081895f710fe101ac5"
              }
            }
          },
          {
            "className": "Build_MinerMk1_C",
            "displayName": "Miner Mk.1",
            "description": "Extracts solid resources from the resource node it is built on. \r\nDefault extraction rate is 60 resources per minute. \r\nExtraction rate varies based on resource node purity. Outputs all extracted resources onto connected Conveyor Belts.",
            "extractCycleTime": 1,
            "itemsPerCycle": 1,
            "powerConsumption": 5,
            "powerConsumptionExponent": 1.321929,
            "minPotential": 0.01,
            "maxPotential": 1,
            "productionBoost": 1,
            "extractorType": "Miner",
            "descriptor": {
              "className": "Desc_MinerMk1_C",
              "displayName": "MinerMk1",
              "form": "RF_INVALID",
              "sinkablePoints": null,
              "category": "Building",
              "extractedIn": [],
              "icon": {
                "objectPath": "FactoryGame/Content/FactoryGame/Buildable/Factory/MinerMK1/UI/IconDesc_MinerMk1_512.png",
                "link": "http://51.178.82.124:9000/assets/FactoryGame/Content/FactoryGame/Buildable/Factory/MinerMK1/UI/IconDesc_MinerMk1_512.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=cYuJwwEItp7cP7Z29mBX%2F20241203%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241203T231557Z&X-Amz-Expires=172800&X-Amz-SignedHeaders=host&X-Amz-Signature=9653423feed29f2d625c64b602ef87d3fb392d473841c0d0305cd9a92d700681"
              }
            }
          },
          {
            "className": "Build_MinerMk2_C",
            "displayName": "Miner Mk.2",
            "description": "Extracts solid resources from the resource node it is built on. \r\nDefault extraction rate is 120 resources per minute. \r\nExtraction rate varies based on resource node purity. Outputs all extracted resources onto connected Conveyor Belts.",
            "extractCycleTime": 0.5,
            "itemsPerCycle": 1,
            "powerConsumption": 15,
            "powerConsumptionExponent": 1.321929,
            "minPotential": 0.01,
            "maxPotential": 1,
            "productionBoost": 1,
            "extractorType": "Miner",
            "descriptor": {
              "className": "Desc_MinerMk2_C",
              "displayName": "MinerMk2",
              "form": "RF_INVALID",
              "sinkablePoints": null,
              "category": "Building",
              "extractedIn": [],
              "icon": {
                "objectPath": "FactoryGame/Content/FactoryGame/Buildable/Factory/MinerMk2/UI/IconDesc_MinerMk2_512.png",
                "link": "http://51.178.82.124:9000/assets/FactoryGame/Content/FactoryGame/Buildable/Factory/MinerMk2/UI/IconDesc_MinerMk2_512.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=cYuJwwEItp7cP7Z29mBX%2F20241203%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241203T231557Z&X-Amz-Expires=172800&X-Amz-SignedHeaders=host&X-Amz-Signature=917ea617be8e0d481082cb9be01fe16171f05e2b7f6d2a0df9643cfea150199b"
              }
            }
          }
        ],
        "icon": {
          "objectPath": "FactoryGame/Content/FactoryGame/Resource/RawResources/Nodes/UI/IconDesc_iron_new_256.png",
          "link": "http://51.178.82.124:9000/assets/FactoryGame/Content/FactoryGame/Resource/RawResources/Nodes/UI/IconDesc_iron_new_256.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=cYuJwwEItp7cP7Z29mBX%2F20241203%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241203T231557Z&X-Amz-Expires=172800&X-Amz-SignedHeaders=host&X-Amz-Signature=09081c4c9a8a9e1606b8d7600294930e3436a87b56001f801f1d97d222ac2d7d"
        }
      },
      "manufacturing": {
        "className": "Build_MinerMk3_C",
        "displayName": "Miner Mk.3",
        "description": "Extracts solid resources from the resource node it is built on. \r\nDefault extraction rate is 240 resources per minute. \r\nExtraction rate varies based on resource node purity. Outputs all extracted resources onto connected Conveyor Belts.",
        "extractCycleTime": 0.25,
        "itemsPerCycle": 1,
        "powerConsumption": 45,
        "powerConsumptionExponent": 1.321929,
        "minPotential": 0.01,
        "maxPotential": 1,
        "productionBoost": 1,
        "extractorType": "Miner",
        "descriptor": {
          "className": "Desc_MinerMk3_C",
          "displayName": "MinerMk3",
          "form": "RF_INVALID",
          "sinkablePoints": null,
          "category": "Building",
          "extractedIn": [],
          "icon": {
            "objectPath": "FactoryGame/Content/FactoryGame/Buildable/Factory/MinerMk3/UI/IconDesc_MinerMk3_512.png",
            "link": "http://51.178.82.124:9000/assets/FactoryGame/Content/FactoryGame/Buildable/Factory/MinerMk3/UI/IconDesc_MinerMk3_512.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=cYuJwwEItp7cP7Z29mBX%2F20241203%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241203T231557Z&X-Amz-Expires=172800&X-Amz-SignedHeaders=host&X-Amz-Signature=41576999bd8570dac6a213b3d4f3be5b845a75927e7ce8081895f710fe101ac5"
          }
        }
      },
      "requiredAmount": 0
    }
  ] as unknown as SealedRequirement[],
  expectedGraph: {
    node: [
      {
        id: "Recipe_IronPlate_C",
        requiredMachines: 15.0
      },
      {
        id: "Recipe_IronRod_C",
        requiredMachines: 20.0
      },
      {
        id: "Recipe_IngotIron_C",
        requiredMachines: 25.0
      },
    ],
    edges: [
      {
        "source": "Desc_OreIron_C-Build_MinerMk3_C",
        "target": "Desc_OreIron_C",
        totalOutputPerMinute: 750.0
      },
      {
        "source": "Desc_OreIron_C",
        "target": "Recipe_IngotIron_C",
        totalOutputPerMinute: 750.0
      },
      {
        "source": "Desc_OreIron_C",
        "target": "Recipe_IngotIron_C",
        totalOutputPerMinute: 750.0
      },
      {
        "source": "Recipe_IngotIron_C",
        "target": "Desc_IronIngot_C",
        totalOutputPerMinute: 750.0
      },
      {
        "source": "Desc_IronIngot_C",
        "target": "Recipe_IronPlate_C",
        totalOutputPerMinute: 450.0
      },
      {
        "source": "Desc_IronIngot_C",
        "target": "Recipe_IronRod_C",
        totalOutputPerMinute: 300.0
      },
      {
        "source": "Recipe_IronPlate_C",
        "target": "Desc_IronPlate_C",
        totalOutputPerMinute: 300.0
      },
      {
        "source": "Recipe_IronRod_C",
        "target": "Desc_IronRod_C",
        totalOutputPerMinute: 300.0
      },
    ]
  }
}
