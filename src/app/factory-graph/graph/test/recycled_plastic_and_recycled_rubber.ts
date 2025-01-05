import {SealedRequirement} from "../node.factory";

export const Recycled_plastic_and_recycled_rubber = {
  name: 'Recycled_plastic_and_recycled_rubber',
  requirements: [
    {
      "item": {
        "className": "Desc_Plastic_C",
        "displayName": "Plastic",
        "form": "RF_SOLID",
        "sinkablePoints": 75,
        "category": "Craftable",
        "extractedIn": [],
        "icon": {
          "objectPath": "FactoryGame/Content/FactoryGame/Resource/Parts/Plastic/UI/IconDesc_Plastic_256.png",
          "link": "http://51.178.82.124:9000/assets/FactoryGame/Content/FactoryGame/Resource/Parts/Plastic/UI/IconDesc_Plastic_256.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=cYuJwwEItp7cP7Z29mBX%2F20241203%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241203T232444Z&X-Amz-Expires=172800&X-Amz-SignedHeaders=host&X-Amz-Signature=77c912a7b43dc420fed0ba53a556d0d8ef06c4766219587ffa498fc52d554742"
        }
      },
      "manufacturing": {
        "className": "Recipe_Alternate_Plastic_1_C",
        "manufacturingDuration": 12,
        "displayName": "Alternate: Recycled Plastic",
        "manufacturedIn": [
          {
            "className": "Build_OilRefinery_C",
            "displayName": "Refinery",
            "description": "Refines fluid and/or solid parts into other parts.\r\nHead Lift: 10 m\r\n(Allows fluids to be transported 10 meters upwards.)\r\n\r\nContains both Conveyor Belt and Pipeline input and output ports so that a wide range of recipes can be automated.",
            "manufacturingSpeed": 1,
            "powerConsumption": 30,
            "powerConsumptionExponent": 1.321929,
            "minPotential": 0.01,
            "maxPotential": 1,
            "productionBoost": 1,
            "descriptor": {
              "className": "Desc_OilRefinery_C",
              "displayName": "OilRefinery",
              "form": "RF_INVALID",
              "sinkablePoints": null,
              "category": "Building",
              "extractedIn": [],
              "icon": {
                "objectPath": "FactoryGame/Content/FactoryGame/Buildable/Factory/OilRefinery/UI/IconDesc_OilRefinery_512.png",
                "link": "http://51.178.82.124:9000/assets/FactoryGame/Content/FactoryGame/Buildable/Factory/OilRefinery/UI/IconDesc_OilRefinery_512.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=cYuJwwEItp7cP7Z29mBX%2F20241203%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241203T232444Z&X-Amz-Expires=172800&X-Amz-SignedHeaders=host&X-Amz-Signature=1f485a84f39f19b64cb252b830e78af3b515fa2b45da6168fff15466213a8585"
              }
            }
          }
        ],
        "producing": [
          {
            "item": {
              "className": "Desc_Plastic_C",
              "displayName": "Plastic",
              "form": "RF_SOLID",
              "sinkablePoints": 75,
              "category": "Craftable",
              "extractedIn": [],
              "icon": {
                "objectPath": "FactoryGame/Content/FactoryGame/Resource/Parts/Plastic/UI/IconDesc_Plastic_256.png",
                "link": "http://51.178.82.124:9000/assets/FactoryGame/Content/FactoryGame/Resource/Parts/Plastic/UI/IconDesc_Plastic_256.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=cYuJwwEItp7cP7Z29mBX%2F20241203%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241203T232444Z&X-Amz-Expires=172800&X-Amz-SignedHeaders=host&X-Amz-Signature=77c912a7b43dc420fed0ba53a556d0d8ef06c4766219587ffa498fc52d554742"
              }
            },
            "outputPerCycle": 12,
            "actualOutputPerCycle": 12
          }
        ],
        "manufacturingDurationByMinute": 5
      },
      "requiredAmount": 60
    },
    {
      "item": {
        "className": "Desc_Rubber_C",
        "displayName": "Rubber",
        "form": "RF_SOLID",
        "sinkablePoints": 60,
        "category": "Craftable",
        "extractedIn": [],
        "icon": {
          "objectPath": "FactoryGame/Content/FactoryGame/Resource/Parts/Rubber/UI/IconDesc_Rubber_256.png",
          "link": "http://51.178.82.124:9000/assets/FactoryGame/Content/FactoryGame/Resource/Parts/Rubber/UI/IconDesc_Rubber_256.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=cYuJwwEItp7cP7Z29mBX%2F20241203%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241203T232444Z&X-Amz-Expires=172800&X-Amz-SignedHeaders=host&X-Amz-Signature=ada4788d6647c28a7948812b7841d4bc1ff734c79fa6002e3d4689941feaed32"
        }
      },
      "manufacturing": {
        "className": "Recipe_Alternate_RecycledRubber_C",
        "manufacturingDuration": 12,
        "displayName": "Alternate: Recycled Rubber",
        "manufacturedIn": [
          {
            "className": "Build_OilRefinery_C",
            "displayName": "Refinery",
            "description": "Refines fluid and/or solid parts into other parts.\r\nHead Lift: 10 m\r\n(Allows fluids to be transported 10 meters upwards.)\r\n\r\nContains both Conveyor Belt and Pipeline input and output ports so that a wide range of recipes can be automated.",
            "manufacturingSpeed": 1,
            "powerConsumption": 30,
            "powerConsumptionExponent": 1.321929,
            "minPotential": 0.01,
            "maxPotential": 1,
            "productionBoost": 1,
            "descriptor": {
              "className": "Desc_OilRefinery_C",
              "displayName": "OilRefinery",
              "form": "RF_INVALID",
              "sinkablePoints": null,
              "category": "Building",
              "extractedIn": [],
              "icon": {
                "objectPath": "FactoryGame/Content/FactoryGame/Buildable/Factory/OilRefinery/UI/IconDesc_OilRefinery_512.png",
                "link": "http://51.178.82.124:9000/assets/FactoryGame/Content/FactoryGame/Buildable/Factory/OilRefinery/UI/IconDesc_OilRefinery_512.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=cYuJwwEItp7cP7Z29mBX%2F20241203%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241203T232444Z&X-Amz-Expires=172800&X-Amz-SignedHeaders=host&X-Amz-Signature=1f485a84f39f19b64cb252b830e78af3b515fa2b45da6168fff15466213a8585"
              }
            }
          }
        ],
        "producing": [
          {
            "item": {
              "className": "Desc_Rubber_C",
              "displayName": "Rubber",
              "form": "RF_SOLID",
              "sinkablePoints": 60,
              "category": "Craftable",
              "extractedIn": [],
              "icon": {
                "objectPath": "FactoryGame/Content/FactoryGame/Resource/Parts/Rubber/UI/IconDesc_Rubber_256.png",
                "link": "http://51.178.82.124:9000/assets/FactoryGame/Content/FactoryGame/Resource/Parts/Rubber/UI/IconDesc_Rubber_256.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=cYuJwwEItp7cP7Z29mBX%2F20241203%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241203T232444Z&X-Amz-Expires=172800&X-Amz-SignedHeaders=host&X-Amz-Signature=ada4788d6647c28a7948812b7841d4bc1ff734c79fa6002e3d4689941feaed32"
              }
            },
            "outputPerCycle": 12,
            "actualOutputPerCycle": 12
          }
        ],
        "manufacturingDurationByMinute": 5
      },
      "requiredAmount": 0
    },
    {
      "item": {
        "className": "Desc_LiquidFuel_C",
        "displayName": "Fuel",
        "form": "RF_LIQUID",
        "sinkablePoints": 75,
        "category": "Craftable",
        "extractedIn": [],
        "icon": {
          "objectPath": "FactoryGame/Content/FactoryGame/Resource/Parts/Fuel/UI/IconDesc_LiquidFuel_Pipe_256.png",
          "link": "http://51.178.82.124:9000/assets/FactoryGame/Content/FactoryGame/Resource/Parts/Fuel/UI/IconDesc_LiquidFuel_Pipe_256.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=cYuJwwEItp7cP7Z29mBX%2F20241203%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241203T232444Z&X-Amz-Expires=172800&X-Amz-SignedHeaders=host&X-Amz-Signature=a0e5cb58b991036cb1ea4ced4f5e7b652534739b394fa7f02d12928ea75a5807"
        }
      },
      "manufacturing": {
        "className": "Recipe_LiquidFuel_C",
        "manufacturingDuration": 6,
        "displayName": "Fuel",
        "manufacturedIn": [
          {
            "className": "Build_OilRefinery_C",
            "displayName": "Refinery",
            "description": "Refines fluid and/or solid parts into other parts.\r\nHead Lift: 10 m\r\n(Allows fluids to be transported 10 meters upwards.)\r\n\r\nContains both Conveyor Belt and Pipeline input and output ports so that a wide range of recipes can be automated.",
            "manufacturingSpeed": 1,
            "powerConsumption": 30,
            "powerConsumptionExponent": 1.321929,
            "minPotential": 0.01,
            "maxPotential": 1,
            "productionBoost": 1,
            "descriptor": {
              "className": "Desc_OilRefinery_C",
              "displayName": "OilRefinery",
              "form": "RF_INVALID",
              "sinkablePoints": null,
              "category": "Building",
              "extractedIn": [],
              "icon": {
                "objectPath": "FactoryGame/Content/FactoryGame/Buildable/Factory/OilRefinery/UI/IconDesc_OilRefinery_512.png",
                "link": "http://51.178.82.124:9000/assets/FactoryGame/Content/FactoryGame/Buildable/Factory/OilRefinery/UI/IconDesc_OilRefinery_512.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=cYuJwwEItp7cP7Z29mBX%2F20241203%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241203T232444Z&X-Amz-Expires=172800&X-Amz-SignedHeaders=host&X-Amz-Signature=1f485a84f39f19b64cb252b830e78af3b515fa2b45da6168fff15466213a8585"
              }
            }
          }
        ],
        "producing": [
          {
            "item": {
              "className": "Desc_LiquidFuel_C",
              "displayName": "Fuel",
              "form": "RF_LIQUID",
              "sinkablePoints": 75,
              "category": "Craftable",
              "extractedIn": [],
              "icon": {
                "objectPath": "FactoryGame/Content/FactoryGame/Resource/Parts/Fuel/UI/IconDesc_LiquidFuel_Pipe_256.png",
                "link": "http://51.178.82.124:9000/assets/FactoryGame/Content/FactoryGame/Resource/Parts/Fuel/UI/IconDesc_LiquidFuel_Pipe_256.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=cYuJwwEItp7cP7Z29mBX%2F20241203%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241203T232444Z&X-Amz-Expires=172800&X-Amz-SignedHeaders=host&X-Amz-Signature=a0e5cb58b991036cb1ea4ced4f5e7b652534739b394fa7f02d12928ea75a5807"
              }
            },
            "outputPerCycle": 4000,
            "actualOutputPerCycle": 4
          },
          {
            "item": {
              "className": "Desc_PolymerResin_C",
              "displayName": "Polymer Resin",
              "form": "RF_SOLID",
              "sinkablePoints": 12,
              "category": "Craftable",
              "extractedIn": [],
              "icon": {
                "objectPath": "FactoryGame/Content/FactoryGame/Resource/Parts/PolymerResin/UI/IconDesc_PolymerResin_256.png",
                "link": "http://51.178.82.124:9000/assets/FactoryGame/Content/FactoryGame/Resource/Parts/PolymerResin/UI/IconDesc_PolymerResin_256.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=cYuJwwEItp7cP7Z29mBX%2F20241203%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241203T232444Z&X-Amz-Expires=172800&X-Amz-SignedHeaders=host&X-Amz-Signature=2adfcb26b2fdfd56e27ceb39487c6137581b99175cdf21aabe6a3fdb9685c60c"
              }
            },
            "outputPerCycle": 3,
            "actualOutputPerCycle": 3
          }
        ],
        "manufacturingDurationByMinute": 10
      },
      "requiredAmount": 0
    },
    {
      "item": {
        "className": "Desc_LiquidOil_C",
        "displayName": "Crude Oil",
        "form": "RF_LIQUID",
        "sinkablePoints": 30,
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
                "link": "http://51.178.82.124:9000/assets/FactoryGame/Content/FactoryGame/Buildable/Factory/FrackingExtractor/UI/IconDesc_Extractor_512.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=cYuJwwEItp7cP7Z29mBX%2F20241203%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241203T232445Z&X-Amz-Expires=172800&X-Amz-SignedHeaders=host&X-Amz-Signature=e5236f33eede2e3eb83b6fb156b7703a43c7c34e8ef7de9dc8fefadc97f2ff71"
              }
            }
          },
          {
            "className": "Build_OilPump_C",
            "displayName": "Oil Extractor",
            "description": "Extracts Crude Oil when built on an oil node. Extraction rates vary based on node purity.\r\n\r\nDefault Extraction Rate: 120 m³ of oil per minute.\r\nHead Lift: 10 m\r\n(Allows fluids to be transported 10 meters upwards.)",
            "extractCycleTime": 1,
            "itemsPerCycle": 2000,
            "powerConsumption": 40,
            "powerConsumptionExponent": 1.321929,
            "minPotential": 0.01,
            "maxPotential": 1,
            "productionBoost": 1,
            "extractorType": "None",
            "descriptor": {
              "className": "Desc_OilPump_C",
              "displayName": "OilPump",
              "form": "RF_INVALID",
              "sinkablePoints": null,
              "category": "Building",
              "extractedIn": [],
              "icon": {
                "objectPath": "FactoryGame/Content/FactoryGame/Buildable/Factory/OilPump/UI/OilPump_512.png",
                "link": "http://51.178.82.124:9000/assets/FactoryGame/Content/FactoryGame/Buildable/Factory/OilPump/UI/OilPump_512.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=cYuJwwEItp7cP7Z29mBX%2F20241203%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241203T232445Z&X-Amz-Expires=172800&X-Amz-SignedHeaders=host&X-Amz-Signature=3e333298a135c4e395f12cc69d146274bbe0c15147e2b17d2e4e5c8dbd28af7b"
              }
            }
          }
        ],
        "icon": {
          "objectPath": "FactoryGame/Content/FactoryGame/Resource/RawResources/CrudeOil/UI/LiquidOil_Pipe_512.png",
          "link": "http://51.178.82.124:9000/assets/FactoryGame/Content/FactoryGame/Resource/RawResources/CrudeOil/UI/LiquidOil_Pipe_512.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=cYuJwwEItp7cP7Z29mBX%2F20241203%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241203T232445Z&X-Amz-Expires=172800&X-Amz-SignedHeaders=host&X-Amz-Signature=da39b51b49ceb242f437a262e18fbe38f5be577a79d2e8289a484adc3fae2584"
        }
      },
      "manufacturing": {
        "className": "Build_OilPump_C",
        "displayName": "Oil Extractor",
        "description": "Extracts Crude Oil when built on an oil node. Extraction rates vary based on node purity.\r\n\r\nDefault Extraction Rate: 120 m³ of oil per minute.\r\nHead Lift: 10 m\r\n(Allows fluids to be transported 10 meters upwards.)",
        "extractCycleTime": 1,
        "itemsPerCycle": 2000,
        "powerConsumption": 40,
        "powerConsumptionExponent": 1.321929,
        "minPotential": 0.01,
        "maxPotential": 1,
        "productionBoost": 1,
        "extractorType": "None",
        "descriptor": {
          "className": "Desc_OilPump_C",
          "displayName": "OilPump",
          "form": "RF_INVALID",
          "sinkablePoints": null,
          "category": "Building",
          "extractedIn": [],
          "icon": {
            "objectPath": "FactoryGame/Content/FactoryGame/Buildable/Factory/OilPump/UI/OilPump_512.png",
            "link": "http://51.178.82.124:9000/assets/FactoryGame/Content/FactoryGame/Buildable/Factory/OilPump/UI/OilPump_512.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=cYuJwwEItp7cP7Z29mBX%2F20241203%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241203T232445Z&X-Amz-Expires=172800&X-Amz-SignedHeaders=host&X-Amz-Signature=3e333298a135c4e395f12cc69d146274bbe0c15147e2b17d2e4e5c8dbd28af7b"
          }
        }
      },
      "requiredAmount": 0
    }
  ] as unknown as SealedRequirement[],
  expectedGraph: {
    node: [
      {
        id: "Recipe_LiquidFuel_C",
        requiredMachines: 1.4999999105930328
      },
      {
        id: "Recipe_Alternate_Plastic_1_C",
        requiredMachines: 1.3333333134651184
      },
      {
        id: "Recipe_Alternate_RecycledRubber_C",
        requiredMachines: 0.6666666567325592
      },
    ],
    edges: [
      {
        "source": "Recipe_Alternate_Plastic_1_C",
        "target": "Desc_Plastic_C",
        "totalOutputPerMinute": 79.9999988079071,
      },
      {
        "source": "Desc_LiquidFuel_C",
        "target": "Recipe_Alternate_Plastic_1_C",
        "totalOutputPerMinute": 39.99999940395355,
        "id": "aay5n"
      },
      {
        "source": "Desc_Rubber_C",
        "target": "Recipe_Alternate_Plastic_1_C",
        "totalOutputPerMinute": 39.99999940395355,
      },
      {
        "source": "Recipe_Alternate_RecycledRubber_C",
        "target": "Desc_Rubber_C",
        "totalOutputPerMinute": 39.99999940395355,
      },
      {
        "source": "Desc_Plastic_C",
        "target": "Recipe_Alternate_RecycledRubber_C",
        "totalOutputPerMinute": 19.999999701976776,
      },
      {
        "source": "Desc_LiquidFuel_C",
        "target": "Recipe_Alternate_RecycledRubber_C",
        "totalOutputPerMinute": 19.999999701976776,
      },
      {
        "source": "Recipe_LiquidFuel_C",
        "target": "Desc_LiquidFuel_C",
        "totalOutputPerMinute": 59.99999642372131,
      },
      {
        "source": "Recipe_LiquidFuel_C",
        "target": "Desc_PolymerResin_C",
        "totalOutputPerMinute": 44.999997317790985,
      },
      {
        "source": "Desc_LiquidOil_C",
        "target": "Recipe_LiquidFuel_C",
        "totalOutputPerMinute": 89.99999463558197,
      },
      {
        "source": "Desc_LiquidOil_C-Build_OilPump_C",
        "target": "Desc_LiquidOil_C",
        "totalOutputPerMinute": 89.99999463558197,
      }
    ]
  }
}
