import { useCallback } from 'react';
import { Handle, Position, NodeToolbar, useReactFlow } from '@xyflow/react';

const CustomNode = ({ id, data }) => {
  const { setNodes } = useReactFlow();

  // Provide safe defaults for all properties
  const safeData = {
    mainLabel: data.mainLabel || { text: '', translation: '', crossed: false },
    subpoints: data.subpoints || [],
    images: data.images || [],
    showTranslations: data.showTranslations || false,
    showText: data.showText !== undefined ? data.showText : true,
    showImages: data.showImages !== undefined ? data.showImages : true
  };

  const {
    mainLabel,
    subpoints,
    images,
    showTranslations,
    showText,
    showImages
  } = safeData;

  // Update node data helper
  const updateNodeData = useCallback((newData) => {
    setNodes(nodes =>
      nodes.map(node =>
        node.id === id
          ? { ...node, data: { ...node.data, ...newData } }
          : node
      )
    );
  }, [id, setNodes]);

  // Toolbar actions
  const toggleTranslations = () => updateNodeData({ showTranslations: !showTranslations });
  const toggleTextVisibility = () => updateNodeData({ showText: !showText });
  const toggleImageVisibility = () => updateNodeData({ showImages: !showImages });
  const toggleMainLabelCrossed = () => updateNodeData({
    mainLabel: { ...mainLabel, crossed: !mainLabel.crossed }
  });

  const toggleSubpointCrossed = (index) => () => {
    const updatedSubpoints = [...subpoints];
    updatedSubpoints[index] = {
      ...updatedSubpoints[index],
      crossed: !updatedSubpoints[index].crossed
    };
    updateNodeData({ subpoints: updatedSubpoints });
  };

  return (
    <div className="custom-node">
      <Handle type="target" position={Position.Top} />

      <NodeToolbar position={Position.Top}>
        <div className="toolbar-content">
          <button onClick={toggleTranslations} className="nodrag">
            {showTranslations ? 'Hide Translations' : 'Show Translations'}
          </button>
          <button onClick={toggleTextVisibility} className="nodrag">
            {showText ? 'Hide Text' : 'Show Text'}
          </button>
          <button onClick={toggleImageVisibility} className="nodrag">
            {showImages ? 'Hide Images' : 'Show Images'}
          </button>
          <button onClick={toggleMainLabelCrossed} className="nodrag">
            {mainLabel.crossed ? 'Uncross Main' : 'Cross Main'}
          </button>
        </div>
      </NodeToolbar>

      {showText && (
        <div className="text-content">
          <div className={`main-label ${mainLabel.crossed ? 'crossed' : ''}`}>
            {mainLabel.text}
            {showTranslations && mainLabel.translation && (
              <span className="translation"> ({mainLabel.translation})</span>
            )}
          </div>

          {subpoints.map((sp, index) => (
            <div
              key={index}
              className={`subpoint ${sp.crossed ? 'crossed' : ''}`}
            >
              <span>
                {sp.text}
                {showTranslations && sp.translation && (
                  <span className="translation"> ({sp.translation})</span>
                )}
              </span>
              <button
                onClick={toggleSubpointCrossed(index)}
                className="nodrag subpoint-cross"
              >
                {sp.crossed ? '✓' : '✕'}
              </button>
            </div>
          ))}
        </div>
      )}

      {showImages && images.length > 0 && (
        <div className="image-content">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Image ${index + 1}`}
              className="node-image"
              width={50}
              height={50}
            />
          ))}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default CustomNode;