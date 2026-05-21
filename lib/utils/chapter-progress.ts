import { ContentNode } from "../types";

function computeMinDepths(
  nodes: Record<string, ContentNode>,
  initialNodeId: string,
): Map<string, number> {
  const depths = new Map<string, number>();
  const queue: { id: string; depth: number }[] = [{ id: initialNodeId, depth: 0 }];

  while (queue.length > 0) {
    const { id, depth } = queue.shift()!;
    if (depths.has(id)) continue;
    depths.set(id, depth);

    const node = nodes[id];
    if (!node) continue;

    if (node.nextNodeId) {
      queue.push({ id: node.nextNodeId, depth: depth + 1 });
    }
    if (node.choices) {
      for (const choice of node.choices) {
        queue.push({ id: choice.nextNodeId, depth: depth + 1 });
      }
    }
  }

  return depths;
}

/**
 * Maps the current node position in the story graph to a chapter number (1..totalChapters).
 */
export function getProgressChapterNumber(
  nodes: Record<string, ContentNode>,
  initialNodeId: string,
  currentNodeId: string,
  totalChapters: number,
): number {
  if (totalChapters < 1) return 1;

  const depths = computeMinDepths(nodes, initialNodeId);
  const currentDepth = depths.get(currentNodeId) ?? 0;
  const maxDepth = Math.max(0, ...depths.values());

  if (maxDepth === 0) return 1;

  const index = Math.floor((currentDepth / maxDepth) * (totalChapters - 1));
  return Math.min(totalChapters, index + 1);
}
