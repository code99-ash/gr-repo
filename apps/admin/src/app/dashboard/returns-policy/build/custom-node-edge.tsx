import React, { type FC } from 'react';
import {
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
  type EdgeProps,
  type Edge,
} from '@xyflow/react';
import { useReactflowStore } from '@/store/react-flow/reactflow-store';

const yes_no_options: Record<any, string> = {
  'Yes': 'bg-primary text-white',
  'No': 'bg-destructive text-white'
}

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
  const edges = useReactflowStore(state => state.edges);
  const edge = edges.find(each => each.id === id);

  // Get the bezier path for edge positioning
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  

  if(!data || !edge) return null;

  let label_bg = yes_no_options[edge.label as string] ?? 'bg-background'

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
