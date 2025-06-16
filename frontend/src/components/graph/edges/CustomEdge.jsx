import {
  useReactFlow,
  getBezierPath,
  BaseEdge,
  EdgeLabelRenderer,
  MarkerType
} from '@xyflow/react';
import { useState } from 'react';

export default function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd
}) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const { setEdges } = useReactFlow();
  const [isEditing, setIsEditing] = useState(false);
  const [tempLabel, setTempLabel] = useState(data.label || '');
  const [tempTranslation, setTempTranslation] = useState(data.translation || '');

  // Determine marker type based on arrowType
  const getMarkerType = () => {
    switch(data.arrowType) {
      case 'arrow':
        return MarkerType.Arrow;
      case 'arrowclosed':
        return MarkerType.ArrowClosed;
      case 'none':
        return undefined;
      default:
        return MarkerType.Arrow; // Default to arrow
    }
  };

  const updateEdgeData = (newData) => {
    setEdges(edges => edges.map(edge => {
      if (edge.id === id) {
        return {
          ...edge,
          data: { ...edge.data, ...newData },
          // Update markerEnd when arrowType changes
          markerEnd: newData.arrowType ? {
            type: getMarkerType(),
            color: '#555',
            width: 20,
            height: 20
          } : edge.markerEnd
        };
      }
      return edge;
    }));
  };

  const toggleDirection = () => {
    const newArrowType = data.arrowType === 'none' ? 'arrow' : 'none';
    updateEdgeData({ arrowType: newArrowType });
  };

  const handleSave = () => {
    updateEdgeData({
      label: tempLabel,
      translation: tempTranslation
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempLabel(data.label || '');
    setTempTranslation(data.translation || '');
    setIsEditing(false);
  };

  const toggleTranslation = () => {
    updateEdgeData({
      showTranslation: !data.showTranslation
    });
  };

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{ stroke: '#555', strokeWidth: 2,
        markerEnd: data.arrowType !== 'none' ? `url(#${getMarkerType()})` : undefined
      }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            background: 'rgba(0, 0, 0, 0.9)',
            padding: '5px 10px',
            borderRadius: '5px',
            fontSize: '12px',
            fontWeight: 700,
            boxShadow: '0 0 5px rgba(0,0,0,0.2)',
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          {isEditing ? (
            <div className="edge-edit-form">
              <input
                value={tempLabel}
                onChange={(e) => setTempLabel(e.target.value)}
                placeholder="Label (German)"
                className="edge-input"
              />
              <input
                value={tempTranslation}
                onChange={(e) => setTempTranslation(e.target.value)}
                placeholder="Translation"
                className="edge-input"
              />
              <div className="edge-buttons">
                <button onClick={handleSave} className="edge-button save">
                  Save
                </button>
                <button onClick={handleCancel} className="edge-button cancel">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="edge-display">
              <div className="edge-label" onDoubleClick={() => setIsEditing(true)}>
                {data.label}
              </div>
              {data.showTranslation && data.translation && (
                <div className="edge-translation">
                  {data.translation}
                </div>
              )}
              <div className="edge-actions">
                <button
                  onClick={() => setIsEditing(true)}
                  className="edge-action-button edit"
                >
                  ✏️
                </button>
                <button
                  onClick={toggleTranslation}
                  className="edge-action-button toggle"
                >
                  {data.showTranslation ? '👁️' : '👁️‍🗨️'}
                </button>

              </div>
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

