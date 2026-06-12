import type { Story } from '~/lib/types';

export function countStorySteps(story: Story): number {
  try {
    return story.chapters.reduce((total, chapter) => {
      const nodes = chapter.content?.nodes ?? {};
      return total + Object.keys(nodes).length;
    }, 0);
  } catch {
    return 0;
  }
}

export function estimateMinutesFromSteps(stepCount: number): number {
  const minutes = Math.ceil((stepCount * 30) / 60);
  return Math.max(minutes, 1);
}

export function getStoryDescription(story: Story, maxLen = 100): string {
  try {
    const chapter = story.chapters[0];
    const initialId = chapter?.content.initialNodeId;
    const initialNode = chapter?.content.nodes[initialId ?? ''];
    const text = initialNode?.text ?? '';
    if (text.length <= maxLen) return text;
    return text.slice(0, maxLen).trimEnd() + '…';
  } catch {
    return 'Interactive story';
  }
}

export interface ChoiceMapNode {
  id: string;
  label: string;
  depth: number;
  isBranch: boolean;
  isEnding: boolean;
}

export interface ChoiceMapEdge {
  from: string;
  to: string;
  choiceText?: string;
}

export interface ChoiceMap {
  nodes: ChoiceMapNode[];
  edges: ChoiceMapEdge[];
  branchCount: number;
}

/**
 * Walk chapter 1's narrative graph breadth-first and flatten it into
 * nodes + edges for the detail page's choice-map teaser.
 */
export function getChoiceMap(story: Story, maxDepth = 3): ChoiceMap {
  const content = story.chapters[0]?.content;
  const nodes: ChoiceMapNode[] = [];
  const edges: ChoiceMapEdge[] = [];
  let branchCount = 0;

  if (!content) return { nodes, edges, branchCount };

  const visited = new Set<string>();
  const queue: Array<{ id: string; depth: number }> = [
    { id: content.initialNodeId, depth: 0 },
  ];

  while (queue.length > 0) {
    const { id, depth } = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);

    const node = content.nodes[id];
    if (!node) continue;

    const isBranch = (node.choices?.length ?? 0) > 1;
    const isEnding = !node.nextNodeId && !node.choices?.length;
    if (isBranch) branchCount += 1;

    nodes.push({
      id,
      label: node.text.split(/\s+/).slice(0, 5).join(' ') + '…',
      depth,
      isBranch,
      isEnding,
    });

    if (depth >= maxDepth) continue;

    if (node.nextNodeId) {
      edges.push({ from: id, to: node.nextNodeId });
      queue.push({ id: node.nextNodeId, depth: depth + 1 });
    }

    for (const choice of node.choices ?? []) {
      edges.push({ from: id, to: choice.nextNodeId, choiceText: choice.text });
      queue.push({ id: choice.nextNodeId, depth: depth + 1 });
    }
  }

  return { nodes, edges, branchCount };
}
