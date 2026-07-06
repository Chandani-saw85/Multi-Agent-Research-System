/**
 * Sends a research topic to the Python Flask backend and awaits the complete JSON response.
 */
export async function runResearch(topic) {
  const response = await fetch("/api/research", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ topic }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server returned error status: ${response.status}`);
  }

  return await response.json();
}

export async function fetchHistory() {
  const response = await fetch("/api/history");
  if (!response.ok) {
    throw new Error("Unable to load research history.");
  }
  return await response.json();
}

export async function fetchSaved() {
  const response = await fetch("/api/saved");
  if (!response.ok) {
    throw new Error("Unable to load saved research.");
  }
  return await response.json();
}

export async function saveResearch(id) {
  const response = await fetch(`/api/save/${id}`, { method: "POST" });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Unable to save research.");
  }
  return await response.json();
}

export async function saveResearchEntry(topic, payload) {
  const response = await fetch("/api/research/save-entry", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ topic, payload }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Unable to save research entry.");
  }

  return await response.json();
}
