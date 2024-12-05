// TODO to complete when it works

import {SealedRequirement} from "../node.factory";

export const AluminumScraps300 = {
  name: 'AluminumScraps300',
  requirements: [
    {
      "item": {
        "className": "Desc_AluminumScrap_C",
        "displayName": "Aluminum Scrap",
        "form": "RF_SOLID",
        "sinkablePoints": 27,
        "category": "Craftable",
        "extractedIn": [],
        "icon": {
          "objectPath": "FactoryGame/Content/FactoryGame/Resource/Parts/AluminumScrap/UI/IconDesc_AluminiumScrap_256.png",
          "link": "http://51.178.82.124:9000/assets/FactoryGame/Content/FactoryGame/Resource/Parts/AluminumScrap/UI/IconDesc_AluminiumScrap_256.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=cYuJwwEItp7cP7Z29mBX%2F20241204%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241204T204304Z&X-Amz-Expires=172800&X-Amz-SignedHeaders=host&X-Amz-Signature=6353511acaeb01cfb9c9402c84d3931b980b4445edae7ca301353a02b5b4098e"
        }
      },
      "manufacturing": {
        "className": "Recipe_Alternate_InstantScrap_C",
        "manufacturingDuration": 6,
        "displayName": "Alternate: Instant Scrap",
        "manufacturedIn": [
          {
            "className": "Build_Blender_C",
            "displayName": "Blender",
            "description": "Blends fluids together or combines them with solid parts in a wide variety of processes.\r\nHead Lift: 10 m\r\n(Allows fluids to be transported 10 meters upwards.)\r\n\r\nHas both Conveyor Belt and Pipeline input and output ports.",
            "manufacturingSpeed": 1,
            "powerConsumption": 75,
            "powerConsumptionExponent": 1.321929,
            "minPotential": 0.01,
            "maxPotential": 1,
            "productionBoost": 1,
            "descriptor": {
              "className": "Desc_Blender_C",
              "displayName": "Blender",
              "form": "RF_INVALID",
              "sinkablePoints": null,
              "category": "Building",
              "extractedIn": [],
              "icon": {
                "objectPath": "FactoryGame/Content/FactoryGame/Buildable/Factory/Blender/UI/IconDesc_Blender_512.png",
                "link": "http://51.178.82.124:9000/assets/FactoryGame/Content/FactoryGame/Buildable/Factory/Blender/UI/IconDesc_Blender_512.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=cYuJwwEItp7cP7Z29mBX%2F20241204%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241204T204304Z&X-Amz-Expires=172800&X-Amz-SignedHeaders=host&X-Amz-Signature=0fa77d7801890b45e3ecc94e8889b1ca78fc5f0363e2cefbf243cb301e9b4627"
              }
            }
          }
        ],
        "producing": [
          {
            "item": {
              "className": "Desc_AluminumScrap_C",
              "displayName": "Aluminum Scrap",
              "form": "RF_SOLID",
              "sinkablePoints": 27,
              "category": "Craftable",
              "extractedIn": [],
              "icon": {
                "objectPath": "FactoryGame/Content/FactoryGame/Resource/Parts/AluminumScrap/UI/IconDesc_AluminiumScrap_256.png",
                "link": "http://51.178.82.124:9000/assets/FactoryGame/Content/FactoryGame/Resource/Parts/AluminumScrap/UI/IconDesc_AluminiumScrap_256.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=cYuJwwEItp7cP7Z29mBX%2F20241204%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241204T204304Z&X-Amz-Expires=172800&X-Amz-SignedHeaders=host&X-Amz-Signature=6353511acaeb01cfb9c9402c84d3931b980b4445edae7ca301353a02b5b4098e"
              }
            },
            "outputPerCycle": 30,
            "actualOutputPerCycle": 30
          },
          {
            "item": {
              "className": "Desc_Water_C",
              "displayName": "Water",
              "form": "RF_LIQUID",
              "sinkablePoints": 5,
              "category": "Raw",
              "extractedIn": [
                {
                  "className": "Build_FrackingExtractor_C",
                  "displayName": "Resource Well Extractor",
                  "description": "Collects pressurized resources when placed on the activated sub-nodes of a Resource Well. Does not require power.\r\n\r\nDefault Extraction Rate: 60 m³ of fluid per minute.\r\nHead Lift: 10 m\r\n(Allows fluids to be transported 10 meters upwards.)",
                  "extractCycleTime": 1,
                  "itemsPerCycle": 1000,
                  "powerConsumption": 0,
                  "powerConsumptionExponent": 1.321929,
                  "minPotential": 0.01,
                  "maxPotential": 1,
                  "productionBoost": 1,
                  "extractorType": "None",
                  "descriptor": {
                    "className": "Desc_FrackingExtractor_C",
                    "displayName": "FrackingExtractor",
                    "form": "RF_INVALID",
                    "sinkablePoints": null,
                    "category": "Building",
                    "extractedIn": [],
                    "icon": {
                      "objectPath": "FactoryGame/Content/FactoryGame/Buildable/Factory/FrackingExtractor/UI/IconDesc_Extractor_512.png",
                      "link": "http://51.178.82.124:9000/assets/FactoryGame/Content/FactoryGame/Buildable/Factory/FrackingExtractor/UI/IconDesc_Extractor_512.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=cYuJwwEItp7cP7Z29mBX%2F20241204%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241204T204304Z&X-Amz-Expires=172800&X-Amz-SignedHeaders=host&X-Amz-Signature=686aa2095e562eee22e094f3a959555e69141141205153cbb5383262f9cdca02"
                    }
                  }
                },
                {
                  "className": "Build_WaterPump_C",
                  "displayName": "Water Extractor",
                  "description": "Extracts water from the body of water it is built on.\r\nNote: the water needs to be sufficiently deep, and rivers are generally not deep enough.\r\n\r\nDefault Extraction Rate: 120 m³ of water per minute.\r\nHead Lift: 10 m\r\n(Allows fluids to be transported 10 meters upwards.)",
                  "extractCycleTime": 1,
                  "itemsPerCycle": 2000,
                  "powerConsumption": 20,
                  "powerConsumptionExponent": 1.321929,
                  "minPotential": 0.01,
                  "maxPotential": 1,
                  "productionBoost": 1,
                  "extractorType": "None",
                  "descriptor": {
                    "className": "Desc_WaterPump_C",
                    "displayName": "WaterPump",
                    "form": "RF_INVALID",
                    "sinkablePoints": null,
                    "category": "Building",
                    "extractedIn": [],
                    "icon": {
                      "objectPath": "FactoryGame/Content/FactoryGame/Buildable/Factory/WaterPump/UI/Waterpump_512.png",
                      "link": "http://51.178.82.124:9000/assets/FactoryGame/Content/FactoryGame/Buildable/Factory/WaterPump/UI/Waterpump_512.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=cYuJwwEItp7cP7Z29mBX%2F20241204%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241204T204304Z&X-Amz-Expires=172800&X-Amz-SignedHeaders=host&X-Amz-Signature=dc5bea5aaa30ac00fae8a79ee6fe3dbbedbba63ddc22561c049e5ed2d33057d7"
                    }
                  }
                }
              ],
              "icon": {
                "objectPath": "FactoryGame/Content/FactoryGame/Resource/RawResources/Water/UI/LiquidWater_Pipe_256.png",
                "link": "http://51.178.82.124:9000/assets/FactoryGame/Content/FactoryGame/Resource/RawResources/Water/UI/LiquidWater_Pipe_256.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=cYuJwwEItp7cP7Z29mBX%2F20241204%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241204T204304Z&X-Amz-Expires=172800&X-Amz-SignedHeaders=host&X-Amz-Signature=80de1c2c503e7e4d791456146a1f2c354f5efed730e0c28ebb2c4352c84fde06"
              }
            },
            "outputPerCycle": 5000,
            "actualOutputPerCycle": 5
          }
        ],
        "manufacturingDurationByMinute": 10
      },
      "requiredAmount": 300
    }
  ] as unknown as SealedRequirement[],
  expectedGraph: {
    node: [
      {
        id: "Recipe_Alternate_InstantScrap_C",
        requiredMachines: 1.000
      },
    ],
    edges: [
    ]
  }
}
