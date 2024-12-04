import {ROD_300_AND_300_PLATE} from "./test/300_rod_300_plate";
import {GraphNavigator} from "./graph-navigator";
import {lastValueFrom, Subject} from "rxjs";
import {TestBed} from "@angular/core/testing";
import {appConfig} from "../../app.config";
import {makeFactorySiteRequest} from "../item-site.request";
import {
  FactoryEdge,
  FactoryPlannerControllerService,
  GraphFactoryNodeFactoryEdgeNodesInner
} from "../../factory-planner-api";
import {Recycled_plastic_and_recycled_rubber} from "./test/recycled_plastic_and_recycled_rubber";

const testCases = [
  ROD_300_AND_300_PLATE,
  Recycled_plastic_and_recycled_rubber
]


describe('GraphNavigator', () => {
  testCases.forEach(({name, requirements, expectedGraph}) => {
    let graphNodes: GraphFactoryNodeFactoryEdgeNodesInner[]
    let graphEdges: FactoryEdge[]

    describe(name, () => {
      beforeAll(async () => {
        await TestBed.configureTestingModule({
          providers: [
            // TODO should mock
            ...appConfig.providers,
            FactoryPlannerControllerService
          ],
        }).compileComponents();
        const planner = TestBed.inject(FactoryPlannerControllerService);
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
          expect(graphEdge?.totalOutputPerMinute).withContext('Expected edge does not match output per minute').toEqual(edge.totalOutputPerMinute)
        })
      })
      expectedGraph.node.forEach(expectedNode => {
        it(`Testing ${expectedNode.id}`, () => {
          const graphNode = graphNodes.find(e => e.id === expectedNode.id)

          expect(graphNode).withContext('Expected node is not in graph').toBeDefined()
          expect((graphNode as any)?.requiredMachines).withContext('Expected node does not match required machine').toEqual(expectedNode.requiredMachines)
        })
      })

    })
  })
})
