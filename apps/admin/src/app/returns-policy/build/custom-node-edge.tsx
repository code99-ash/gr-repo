import React, { useMemo, type FC } from 'react';
import {
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
  type EdgeProps,
  type Edge,
} from '@xyflow/react';

const CustomEdge: FC<EdgeProps<Edge<{ label: string }>>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}) => {
  // Get the bezier path for edge positioning
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const label_bg = useMemo(() => {
    switch(data?.label) {
      case 'Yes': 
        return 'bg-primary';
      case 'No': 
        return 'bg-destructive';
      default: 
        return 'bg-background border border-border';
    }
  }, [data?.label])

  return (
    <>
      {/* Base Edge */}
      <BaseEdge id={id} path={edgePath}  />

      {/* Conditional Edge Label */}
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              borderRadius: 5,
              fontSize: 10,
              fontWeight: 700,
            }}
            className={`nodrag nopan px-2 py-1 ${label_bg}`}
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default CustomEdge;
