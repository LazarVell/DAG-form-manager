// src/utils/graphTransform.ts
import { Node, Edge } from "reactflow";
import { GraphData, GraphNode, GraphEdge } from "@/types/types";

export function transformGraphToFlowElements(graph: GraphData): {
  nodes: Node[];
  edges: Edge[];
} {
  const nodes: Node[] = graph.nodes.map((node: GraphNode) => ({
    id: node.id,
    type: "default",
    position: node.position,
    data: {
      label: node.data.name,
      ...node.data,
    },
  }));

  const edges: Edge[] = graph.edges.map((edge: GraphEdge, index: number) => ({
    id: `e${edge.source}-${edge.target}-${index}`,
    source: edge.source,
    target: edge.target,
    animated: true,
  }));

  return { nodes, edges };
}

//used for the prefilled values name connection
export function extractFormName(sourcePath: string): string {
  const [formName] = sourcePath.split(".");
  return formName || "Unknown";
}

export function extractMappings(node: GraphNode) {
  return Object.entries(node.data.input_mapping || {}).map(
    ([targetField, value]) => {
      const input = value as { type?: string; value?: string };

      if (
        value &&
        typeof value === "object" &&
        input.type === "form_field" &&
        typeof input.value === "string"
      ) {
        return {
          targetField,
          sourceForm: extractFormName(input.value),
          sourceField: input.value.split(".").pop() || "",
        };
      }

      return {
        targetField,
        sourceForm: "Unknown",
        sourceField: "Unknown",
      };
    }
  );
}
