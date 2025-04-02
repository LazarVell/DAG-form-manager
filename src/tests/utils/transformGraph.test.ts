import { transformGraphToFlowElements } from "@/utils/transformGraph";
import { GraphData } from "@/types/types";

describe("transformGraphToFlowElements", () => {
  it("should correctly transform graph nodes and edges", () => {
    const mockGraph: GraphData = {
      id: "test-graph",
      tenant_id: "1",
      name: "Test Graph",
      description: "For unit testing",
      category: "example",
      nodes: [
        {
          id: "form-A",
          type: "form",
          position: { x: 0, y: 0 },
          data: {
            id: "form-A",
            component_key: "",
            component_type: "",
            component_id: "",
            name: "Form A",
            prerequisites: [],
            permitted_roles: [],
            input_mapping: {},
            sla_duration: { number: 0, unit: "minutes" },
            approval_required: false,
            approval_roles: [],
          },
        },
      ],
      edges: [
        {
          source: "form-A",
          target: "form-B",
        },
      ],
      forms: [],
      branches: [],
      triggers: [],
    };

    const { nodes, edges } = transformGraphToFlowElements(mockGraph);

    expect(nodes).toHaveLength(1);
    expect(nodes[0].id).toBe("form-A");
    expect(edges[0].source).toBe("form-A");
  });
});
