**
 * Runs the research pipeline by POSTing the topic to the Flask backend
 * and streaming back Server-Sent Events as each agent completes its stage.
 *
 * Expected event shape from app.py, one JSON object per "data: " line:
 *   { stage: "search" | "reader" | "writer" | "critic", status: "active" }
 *   { stage: "search" | "reader" | "writer" | "critic", status: "done", content: "..." }
 *   { stage: "complete" }
 *   { stage: "error", message: "..." }
 *
 * @param {string} topic
 * @param {(event: object) => void} onEvent - called for every parsed event
 */
export async function runResearch(topic, onEvent) {
  const response = await fetch("/api/research", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ topic }),
  });

  if (!response.ok || !response.body) {
    throw new Error(`Backend returned ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const chunks = buffer.split("\n\n");
    buffer = chunks.pop(); // last chunk may be incomplete, keep it for next read

    for (const chunk of chunks) {
      const line = chunk.split("\n").find((l) => l.startsWith("data:"));
      if (!line) continue;
      try {
        const payload = JSON.parse(line.replace(/^data:\s*/, ""));
        onEvent(payload);
      } catch {
        // ignore malformed chunk
      }
    }
  }
}
