'use client';

import { motion } from 'motion/react';

import { pageTransition } from '~/lib/motion/variants';

// Static export: templates remount per navigation, so transitions are
// enter-only (no exit animation is possible without a server runtime).
export default function Template({ children }: React.PropsWithChildren) {
  return (
    <motion.div
      className="flex flex-1 flex-col"
      variants={pageTransition}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}
