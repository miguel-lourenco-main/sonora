'use client';

import { useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Lock, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { cn } from '@kit/ui/lib';
import { SectionHeading } from '@/components/sonora';

import type { Story } from '~/lib/types';
import { getChoiceMap } from '~/lib/utils/story-meta';

const NODE_W = 190;
const NODE_H = 64;
const COL_GAP = 70;
const ROW_GAP = 28;
const MAX_NODES = 8;

interface ChoiceMapProps {
  story: Story;
}

export function ChoiceMap({ story }: ChoiceMapProps) {
  const { t } = useTranslation('custom');
  const reducedMotion = useReducedMotion();

  const map = useMemo(() => getChoiceMap(story), [story]);

  const layout = useMemo(() => {
    const byDepth = new Map<number, typeof map.nodes>();
    for (const node of map.nodes) {
      const col = byDepth.get(node.depth) ?? [];
      col.push(node);
      byDepth.set(node.depth, col);
    }
    const depths = [...byDepth.keys()].sort((a, b) => a - b);
    const maxRows = Math.max(...depths.map((d) => byDepth.get(d)!.length), 1);
    const height = maxRows * NODE_H + (maxRows - 1) * ROW_GAP;
    const width = depths.length * NODE_W + (depths.length - 1) * COL_GAP;

    const positions = new Map<string, { x: number; y: number }>();
    for (const depth of depths) {
      const column = byDepth.get(depth)!;
      const colHeight = column.length * NODE_H + (column.length - 1) * ROW_GAP;
      const offsetY = (height - colHeight) / 2;
      column.forEach((node, row) => {
        positions.set(node.id, {
          x: depth * (NODE_W + COL_GAP),
          y: offsetY + row * (NODE_H + ROW_GAP),
        });
      });
    }
    return { positions, width, height };
  }, [map]);

  const lockedChapters = Array.from(
    { length: Math.max(story.totalChapters - 1, 0) },
    (_, i) => i + 2,
  );

  return (
    <section aria-label={t('storyDetail.mapTitle', 'Every choice writes a different tale')}>
      <SectionHeading
        eyebrow={t('storyDetail.mapEyebrow', 'Branching paths')}
        title={t('storyDetail.mapTitle', 'Every choice writes a different tale')}
      />

      {map.nodes.length > MAX_NODES ? (
        <p className="flex items-center gap-2 font-body-lg text-body-lg text-on-surface-variant">
          <Sparkles className="size-5 text-tertiary" aria-hidden="true" />
          {t('storyDetail.branchingMoments', {
            count: map.branchCount,
            defaultValue: '{{count}} branching moments await',
          })}
        </p>
      ) : (
        <div className="hide-scrollbar overflow-x-auto pb-2">
          <svg
            width={layout.width}
            height={layout.height}
            viewBox={`0 0 ${layout.width} ${layout.height}`}
            className="min-w-full"
            role="img"
            aria-label={t('storyDetail.branchingMoments', {
              count: map.branchCount,
              defaultValue: '{{count}} branching moments await',
            })}
          >
            {map.edges.map((edge) => {
              const from = layout.positions.get(edge.from);
              const to = layout.positions.get(edge.to);
              if (!from || !to) return null;
              const x1 = from.x + NODE_W;
              const y1 = from.y + NODE_H / 2;
              const x2 = to.x;
              const y2 = to.y + NODE_H / 2;
              const cx = (x1 + x2) / 2;
              const isChoice = Boolean(edge.choiceText);
              return (
                <motion.path
                  key={`${edge.from}-${edge.to}`}
                  d={`M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`}
                  fill="none"
                  strokeWidth={2}
                  className={cn(
                    isChoice ? 'stroke-tertiary-fixed-dim' : 'stroke-outline-variant',
                  )}
                  initial={reducedMotion ? false : { pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                />
              );
            })}
            {map.nodes.map((node) => {
              const pos = layout.positions.get(node.id);
              if (!pos) return null;
              return (
                <foreignObject
                  key={node.id}
                  x={pos.x}
                  y={pos.y}
                  width={NODE_W}
                  height={NODE_H}
                >
                  <div
                    className={cn(
                      'flex h-full items-center rounded-2xl border px-4 py-2 font-body-md text-sm leading-snug',
                      node.isBranch
                        ? 'border-tertiary-fixed/50 bg-tertiary-container/40 text-on-surface magical-glow'
                        : 'border-outline-variant/40 bg-surface-container-low text-on-surface-variant',
                    )}
                  >
                    <span className="line-clamp-2">{node.label}</span>
                  </div>
                </foreignObject>
              );
            })}
          </svg>
        </div>
      )}

      {lockedChapters.length > 0 ? (
        <div className="mt-6 flex flex-wrap gap-3">
          {lockedChapters.map((number) => (
            <span
              key={number}
              className="inline-flex items-center gap-2 rounded-full border border-dashed border-outline-variant/60 px-4 py-2 font-label-lg text-label-lg text-on-surface-variant/70"
            >
              <Lock className="size-4" aria-hidden="true" />
              {t('storyDetail.locked', {
                number,
                defaultValue: 'Chapter {{number}} — unlocks as you listen',
              })}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
}
