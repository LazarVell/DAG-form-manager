import {
  getDirectDependencies,
  getTransitiveDependencies,
} from "@/utils/dependenciesTraversal";
import { extractMappings } from "@/utils/transformGraph";

describe("getDirectDependencies", () => {
  it("returns direct parent nodes by id", () => {
    //I filled out the dummy data to satisfy the type and avoid using any.
    const graph = {
      id: "test",
      tenant_id: "1",
      name: "Test DAG",
      description: "Mock graph",
      category: "demo",
      nodes: [
        {
          id: "a",
          type: "form",
          position: { x: 0, y: 0 },
          data: {
            id: "id-a",
            component_key: "",
            component_type: "",
            component_id: "",
            name: "A",
            prerequisites: [],
            permitted_roles: [],
            input_mapping: {},
            sla_duration: { number: 0, unit: "minutes" },
            approval_required: false,
            approval_roles: [],
          },
        },
        {
          id: "b",
          type: "form",
          position: { x: 0, y: 0 },
          data: {
            id: "id-b",
            component_key: "",
            component_type: "",
            component_id: "",
            name: "B",
            prerequisites: ["a"],
            permitted_roles: [],
            input_mapping: {},
            sla_duration: { number: 0, unit: "minutes" },
            approval_required: false,
            approval_roles: [],
          },
        },
      ],
      edges: [],
      forms: [],
      branches: [],
      triggers: [],
    };
    const result = getDirectDependencies(graph, graph.nodes[1]);
    expect(result).toEqual([{ value: "A" }]);
  });
});

describe("getTransitiveDependencies", () => {
  it("returns ancestors excluding direct ones", () => {
    const graph = {
      id: "test",
      tenant_id: "1",
      name: "test",
      description: "",
      category: "",
      nodes: [
        {
          id: "a",
          type: "form",
          position: { x: 0, y: 0 },
          data: {
            id: "a",
            name: "Form A",
            component_id: "",
            component_key: "",
            component_type: "",
            prerequisites: [],
            permitted_roles: [],
            input_mapping: {},
            sla_duration: { number: 0, unit: "minutes" },
            approval_required: false,
            approval_roles: [],
          },
        },
        {
          id: "b",
          type: "form",
          position: { x: 0, y: 0 },
          data: {
            id: "b",
            name: "Form B",
            component_id: "",
            component_key: "",
            component_type: "",
            prerequisites: ["a"],
            permitted_roles: [],
            input_mapping: {},
            sla_duration: { number: 0, unit: "minutes" },
            approval_required: false,
            approval_roles: [],
          },
        },
        {
          id: "c",
          type: "form",
          position: { x: 0, y: 0 },
          data: {
            id: "c",
            name: "Form C",
            component_id: "",
            component_key: "",
            component_type: "",
            prerequisites: ["b"],
            permitted_roles: [],
            input_mapping: {},
            sla_duration: { number: 0, unit: "minutes" },
            approval_required: false,
            approval_roles: [],
          },
        },
      ],
      edges: [],
      forms: [],
      branches: [],
      triggers: [],
    };

    const result = getTransitiveDependencies(graph, graph.nodes[2]);
    expect(result).toEqual([{ value: "Form A" }]);
  });
});

describe("extractMappings", () => {
  it("returns readable mappings from input_mapping", () => {
    const node = {
      id: "form-a",
      type: "form",
      position: { x: 0, y: 0 },
      data: {
        id: "form-a",
        component_key: "",
        component_type: "",
        component_id: "",
        name: "Form A",
        prerequisites: [],
        permitted_roles: [],
        input_mapping: {
          email: {
            type: "form_field",
            value: "Form A.email",
          },
        },
        sla_duration: {
          number: 0,
          unit: "minutes",
        },
        approval_required: false,
        approval_roles: [],
      },
    };

    const result = extractMappings(node);
    expect(result).toEqual([
      {
        targetField: "email",
        sourceForm: "Form A",
        sourceField: "email",
      },
    ]);
  });
});
