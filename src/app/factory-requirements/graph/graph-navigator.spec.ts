import {ROD_300_AND_300_PLATE} from "./test/300_rod_300_plate";
import {GraphNavigator} from "./graph-navigator";
import {lastValueFrom, Subject} from "rxjs";
import {TestBed} from "@angular/core/testing";
import {appConfig} from "../../app.config";
import {makeFactorySiteRequest} from "../item-site.request";
import {
  Configuration,
  FactoryEdge,
  FactoryPlannerControllerService,
  GraphFactoryNodeFactoryEdgeNodesInner
} from "../../factory-planner-api";
import {Recycled_plastic_and_recycled_rubber} from "./test/recycled_plastic_and_recycled_rubber";
import {HttpClient, HttpXhrBackend} from "@angular/common/http";
import {AluminumScraps300} from "./test/300_aluscraps";
import {CraftingSiteNodeImpl} from "./crafting-site.node";

const testCases = [
  ROD_300_AND_300_PLATE,
  Recycled_plastic_and_recycled_rubber,
  AluminumScraps300
]

function toFixed(nb?: number): string {
  return Number(nb).toFixed(5);
}

describe('GraphNavigator', () => {
  testCases.forEach(({name, requirements, expectedGraph}) => {
    let graphNodes: GraphFactoryNodeFactoryEdgeNodesInner[]
    let graphEdges: FactoryEdge[]

    describe(name, () => {
      beforeAll(async () => {
        const httpClient = new HttpClient(new HttpXhrBackend({
          build: () => new XMLHttpRequest()
        }));
        const planner = new FactoryPlannerControllerService(httpClient, 'http://192.168.1.61:8080', new Configuration())
        const request = requirements.map(e => makeFactorySiteRequest(e))
        const graphNavigator = new GraphNavigator(requirements, new Subject());
        const {nodes, edges} = await lastValueFrom(planner.planFactorySite(request))

        graphNavigator.populate({nodes, edges})

        graphNodes = Array.from(graphNavigator.nodes)
        graphEdges = Array.from(graphNavigator.edges)
      })

      expectedGraph.edges.forEach(edge => {
        it(`Testing ${edge.source}->${edge.target}`, () => {
          const graphEdge = graphEdges.find(e => e.source === edge.source && e.target === edge.target)

          expect(graphEdge).withContext('Expected edge is not in graph').toBeDefined()
          expect(toFixed(graphEdge?.totalOutputPerMinute)).withContext('Expected edge does not match output per minute').toEqual(toFixed(edge?.totalOutputPerMinute))
        })
      })
      expectedGraph.node.forEach(expectedNode => {
        it(`Testing ${expectedNode.id}`, () => {
          const graphNode = graphNodes.find(e => e.id === expectedNode.id) as CraftingSiteNodeImpl

          expect(graphNode).withContext('Expected node is not in graph').toBeDefined()
          expect(toFixed(graphNode?.requiredMachines)).withContext('Expected node does not match required machine').toEqual(toFixed(expectedNode.requiredMachines))
        })
      })

    })
  })
})
