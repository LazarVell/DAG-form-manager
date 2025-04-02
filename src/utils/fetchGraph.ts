import { GraphData } from "@/types/types";

export async function fetchGraph({
  someId,
  blueprintId,
  versionId,
}: {
  someId: string;
  blueprintId: string;
  versionId?: string;
}): Promise<GraphData | null> {
  //I would normally fetch base from a .env or some config file. For ease of deployment I am not creating a .env and calling it here directly.
  const base = "http://localhost:3000";

  //documentation provided specifies a versionId whereas the mock server does not have it. For reusability, versionId is provided as optional.
  const path = versionId
    ? `/api/v1/${someId}/actions/blueprints/${blueprintId}/${versionId}/graph`
    : `/api/v1/${someId}/actions/blueprints/${blueprintId}/graph`;

  try {
    const res = await fetch(`${base}${path}`, {
      method: "GET",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch graph: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching graph:", err);
    return null;
  }
}
