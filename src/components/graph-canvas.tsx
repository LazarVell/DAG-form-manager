"use client";

import { useEffect, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  NodeMouseHandler,
} from "reactflow";
import "reactflow/dist/style.css";

import { fetchGraph } from "@/utils/fetchGraph";
import {
  extractMappings,
  transformGraphToFlowElements,
} from "@/utils/transformGraph";
import { GraphData, GraphNode } from "@/types/types";
import PrefillPanel from "@/components/prefill/PrefillPanel";
import {
  getDirectDependencies,
  getTransitiveDependencies,
} from "@/utils/dependenciesTraversal";
import PrefillSourcePopup from "./prefill/PrefillSourcePopup";
import { SourceOption } from "@/types/types";

export default function GraphCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  //we use the ref to render a floating box for options
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodePosition, setNodePosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  //this ref is for the prefil entry
  const [sourcePopup, setSourcePopup] = useState<{
    field: string;
    x: number;
    y: number;
  } | null>(null);

  //a simple state to control whether the toggle is enabled or not is not viable because it is shared across components
  //we map over all nodes and keep track of the states
  //moving the state inside the PrefillPanel also does not work.
  const [prefillToggleMap, setPrefillToggleMap] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    async function loadGraph() {
      const data = await fetchGraph({
        someId: "123",
        blueprintId: "bp_456",
      });

      if (data) {
        setGraphData(data);
        const { nodes, edges } = transformGraphToFlowElements(data);
        setNodes(nodes);
        setEdges(edges);
      }
    }

    loadGraph();
  }, []);

  const handleNodeClick: NodeMouseHandler = (event, node) => {
    if (!graphData || !reactFlowWrapper.current) return;

    const matched = graphData.nodes.find((n) => n.id === node.id);
    setSelectedNode(matched || null);

    const bounds = reactFlowWrapper.current.getBoundingClientRect();
    setNodePosition({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    });

    //fix for the issue of having the sub-modal opened when switching to another node.
    setSourcePopup(null);
  };

  const getFormById = (graph: GraphData, formId: string) => {
    return graph.forms.find((f) => f.id === formId);
  };

  function handleSelectMapping(source: SourceOption) {
    if (!selectedNode || !graphData || !sourcePopup) return;

    const updatedGraph = {
      ...graphData,
      nodes: graphData.nodes.map((node) => {
        if (node.id !== selectedNode.id) return node;

        const existingMapping = node.data.input_mapping || {};

        return {
          ...node,
          data: {
            ...node.data,
            input_mapping: {
              ...existingMapping,
              [sourcePopup.field]: {
                type: "form_field",
                value: `${source.value}.${sourcePopup.field}`,
              },
            },
          },
        };
      }),
    };

    setGraphData(updatedGraph);
    const updatedSelected =
      updatedGraph.nodes.find((n) => n.id === selectedNode.id) || null;
    setSelectedNode(updatedSelected);
    setSourcePopup(null);
  }

  const prefillEnabled = selectedNode
    ? prefillToggleMap[selectedNode.id] ?? true
    : true;

  function handleRemoveMapping(field: string) {
    if (!selectedNode || !graphData) return;

    const updatedGraph = {
      ...graphData,
      nodes: graphData.nodes.map((node) => {
        if (node.id !== selectedNode.id) return node;

        const newInputMapping = { ...node.data.input_mapping };
        delete newInputMapping[field];

        return {
          ...node,
          data: {
            ...node.data,
            input_mapping: newInputMapping,
          },
        };
      }),
    };

    setGraphData(updatedGraph);
    const updatedSelected =
      updatedGraph.nodes.find((n) => n.id === selectedNode.id) || null;
    setSelectedNode(updatedSelected);
  }

  const form = selectedNode
    ? getFormById(graphData as GraphData, selectedNode.data.component_id)
    : null;

  return (
    <div className="flex w-full h-screen">
      <div className="flex-grow relative" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>

        {selectedNode && form && nodePosition && (
          <div
            className="absolute z-10"
            style={{
              top: nodePosition.y,
              left: nodePosition.x,
            }}
          >
            <PrefillPanel
              availableFields={Object.keys(form.field_schema?.properties || {})}
              mappings={extractMappings(selectedNode)}
              enabled={prefillEnabled}
              onToggle={(enabled) => {
                if (!selectedNode) return;
                setPrefillToggleMap((prev) => ({
                  ...prev,
                  [selectedNode.id]: enabled,
                }));
                if (!enabled) {
                  setSourcePopup(null);
                }
              }}
              onRemoveMapping={handleRemoveMapping}
              onFieldClick={(field, e) => {
                setSourcePopup({
                  field,
                  x: e.clientX,
                  y: e.clientY,
                });
              }}
              onClose={() => {
                setSelectedNode(null);
                setNodePosition(null);
                setSourcePopup(null);
              }}
            />
          </div>
        )}

        {sourcePopup && selectedNode && graphData && (
          <PrefillSourcePopup
            field={sourcePopup.field}
            x={sourcePopup.x}
            y={sourcePopup.y}
            onClose={() => setSourcePopup(null)}
            onSelect={handleSelectMapping}
            direct={getDirectDependencies(graphData, selectedNode)}
            transitive={getTransitiveDependencies(graphData, selectedNode)}
            global={[{ value: "global mock" }]}
          />
        )}
      </div>
    </div>
  );
}
