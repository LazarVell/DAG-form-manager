import { GraphData, GraphNode, SourceOption } from "@/types/types";

export function getDirectDependencies(
  graph: GraphData,
  node: GraphNode
): SourceOption[] {
  return (node.data.prerequisites || [])
    .map((id) => graph.nodes.find((n) => n.id === id))
    .filter((n): n is GraphNode => !!n)
    .map((n) => ({
      value: n.data.name,
    }));
}

export function getTransitiveDependencies(
  graph: GraphData,
  node: GraphNode
): SourceOption[] {
  const visited = new Set<string>();
  const result: SourceOption[] = [];

  function walk(n: GraphNode) {
    for (const prereqId of n.data.prerequisites || []) {
      if (visited.has(prereqId)) continue;
      visited.add(prereqId);

      const prereqNode = graph.nodes.find((nn) => nn.id === prereqId);
      if (prereqNode) {
        result.push({ value: prereqNode.data.name });
        walk(prereqNode);
      }
    }
  }

  walk(node);

  //we remove direct dependencies from transitive here.
  const directNames = new Set(
    (node.data.prerequisites || [])
      .map((id) => graph.nodes.find((n) => n.id === id)?.data.name)
      .filter((name): name is string => !!name)
  );

  return result.filter((entry) => !directNames.has(entry.value));
}
