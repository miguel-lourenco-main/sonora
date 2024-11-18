"use client";

import { cn } from "../lib";
import React, { forwardRef, useCallback, useRef } from "react";
import useResizeObserver from "use-resize-observer";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  Tree,
  Folder,
  File,
  TreeViewElement,
} from "./tree-view-api";

// TODO: Add the ability to add custom icons

interface TreeViewComponentProps extends React.HTMLAttributes<HTMLDivElement> {}

type TreeViewProps = {
  initialSelectedId?: string;
  elements: TreeViewElement[];
  indicator?: boolean;
  openFirst?: boolean;
  setOpenFirst?: (openFirst: boolean) => void;
  onFileClick?: (path: string) => void
} & (
  | {
      initialExpendedItems?: string[];
      expandAll?: false;
    }
  | {
      initialExpendedItems?: undefined;
      expandAll: true;
    }
) &
  TreeViewComponentProps;

export const TreeView = ({
  elements,
  className,
  initialSelectedId,
  initialExpendedItems,
  expandAll,
  onFileClick,
  indicator = false,
  openFirst = false,
  setOpenFirst = () => {},
}: TreeViewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { getVirtualItems, getTotalSize } = useVirtualizer({
    count: elements.length,
    getScrollElement: () => containerRef.current,
    estimateSize: useCallback(() => 40, []),
    overscan: 5,
  });

  const { height = getTotalSize(), width } = useResizeObserver({
    ref: containerRef,
  });
  
  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full rounded-md overflow-y-hidden py-1 relative",
        className
      )}
    >
      <Tree
        initialSelectedId={initialSelectedId}
        initialExpendedItems={initialExpendedItems}
        elements={elements}
        style={{ height, width }}
        className="w-full h-full overflow-y-auto"
        openFirst={openFirst}
        setOpenFirst={setOpenFirst}
        onFileClick={onFileClick}
      >
        {getVirtualItems().map((element, i) => 
          elements[element.index] ? (
            <TreeItem
                aria-label="Root"
                key={element.key}
                elements={[elements[element.index] ?? {id:"", name:""}]} // This is just a fix since the previous check is not being taken into account by the editor, and maybe the compiler
                indicator={indicator}
                index={i}
            />
          ) : (
            <>
            </>
          )
        )}
        {/*<CollapseButton elements={elements} expandAll={expandAll}>
          <span>Expand All</span>
        </CollapseButton>*/}
      </Tree>
    </div>
  );
};

TreeView.displayName = "TreeView";

export const TreeItem = forwardRef<
  HTMLUListElement,
  {
    elements?: TreeViewElement[];
    indicator?: boolean;
    index?: number;
  } & React.HTMLAttributes<HTMLUListElement>
>(({ className, elements, indicator, index, ...props }, ref) => {

  return (
    <ul ref={ref} className="w-full space-y-2 text-foreground" {...props}>
      {elements &&
        elements.map((element, i) => (
          <li key={element.id} className="w-full">
            {element.children && element.children?.length > 0 ? (
              <Folder
                element={element.name}
                value={element.id}
                isSelectable={element.isSelectable}
                expand={ props["aria-label"] === "Root" && index === 0 ? true : false}
              >
                <TreeItem
                  key={element.id}
                  aria-label={`folder ${element.name}`}
                  elements={element.children}
                  indicator={indicator}
                />
              </Folder>
            ) : (
              <File
                value={element.id}
                aria-label={`File ${element.name}`}
                key={element.id}
                path={element.path}
                isSelectable={element.isSelectable}
                className="truncate"
              >
                <span>{element?.name}</span>
              </File>
            )}
          </li>
        ))}
    </ul>
  );
});

TreeItem.displayName = "TreeItem";
