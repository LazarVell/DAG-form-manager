export type GraphNode = {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data: {
    id: string;
    component_key: string;
    component_type: string;
    component_id: string;
    name: string;
    prerequisites: string[];
    permitted_roles: string[];
    input_mapping: Record<string, unknown>;
    sla_duration: {
      number: number;
      unit: string;
    };
    approval_required: boolean;
    approval_roles: string[];
  };
}

export type GraphEdge = {
  source: string;
  target: string;
}

export type GraphForm = {
  id: string;
  name: string;
  description: string;
  is_reusable: boolean;
  field_schema: Record<string, unknown>;
  ui_schema: Record<string, unknown>;
  dynamic_field_config: Record<string, unknown>;
}

export type GraphData = {
  id: string;
  tenant_id: string;
  name: string;
  description: string;
  category: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  forms: GraphForm[];
  branches: unknown[];
  triggers: unknown[];
}

export type SourceOption = {
  value: string;
};