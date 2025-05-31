import { useCallback, useState } from 'react';
import { Handle, Position, NodeToolbar, useReactFlow } from '@xyflow/react';

const CustomNode = ({ id, data }) => {
  const { setNodes } = useReactFlow();
  const [editingMain, setEditingMain] = useState(false);
  const [tempMainText, setTempMainText] = useState('');
  const [editingSubpoint, setEditingSubpoint] = useState(null);
  const [tempSubpointText, setTempSubpointText] = useState('');

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

  // Start editing main label
  const startEditingMain = () => {
    setTempMainText(mainLabel.text);
    setEditingMain(true);
  };

  // Save main label changes
  const saveMainEdit = () => {
    updateNodeData({
      mainLabel: { ...mainLabel, text: tempMainText }
    });
    setEditingMain(false);
  };

  // Start editing a subpoint
  const startEditingSubpoint = (index) => {
    setTempSubpointText(subpoints[index].text);
    setEditingSubpoint(index);
  };

  // Save subpoint changes
  const saveSubpointEdit = (index) => {
    const updatedSubpoints = [...subpoints];
    updatedSubpoints[index] = {
      ...updatedSubpoints[index],
      text: tempSubpointText
    };
    updateNodeData({ subpoints: updatedSubpoints });
    setEditingSubpoint(null);
  };

  // Add a new subpoint
  const addSubpoint = () => {
    const newSubpoint = {
      text: 'New point',
      translation: '',
      crossed: false
    };
    updateNodeData({ subpoints: [...subpoints, newSubpoint] });
  };

  // Remove a subpoint
  const removeSubpoint = (index) => {
    const updatedSubpoints = subpoints.filter((_, i) => i !== index);
    updateNodeData({ subpoints: updatedSubpoints });
  };

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
          <button onClick={addSubpoint} className="nodrag">
            Add Subpoint
          </button>
        </div>
      </NodeToolbar>

      {showText && (
        <div className="text-content">
          <div className="main-label-row">
            {editingMain ? (
              <div className="edit-container">
                <input
                  type="text"
                  value={tempMainText}
                  onChange={(e) => setTempMainText(e.target.value)}
                  className="edit-input nodrag"
                  autoFocus
                />
                <button
                  onClick={saveMainEdit}
                  className="save-button nodrag"
                >
                  ✓
                </button>
              </div>
            ) : (
              <div className="label-container">
                <span className={`main-label-text ${mainLabel.crossed ? 'crossed' : ''}`}>
                  {mainLabel.text}
                </span>
                {showTranslations && mainLabel.translation && (
                  <span className="translation"> ({mainLabel.translation})</span>
                )}
              </div>
            )}
            <div className="main-buttons">
              <button
                onClick={toggleMainLabelCrossed}
                className="cross-button nodrag"
              >
                {mainLabel.crossed ? '✓' : '✕'}
              </button>
              <button
                onClick={startEditingMain}
                className="edit-button nodrag"
              >
                ✎
              </button>
            </div>
          </div>

          {subpoints.map((sp, index) => (
            <div key={index} className="subpoint-row">
              {editingSubpoint === index ? (
                <div className="edit-container">
                  <input
                    type="text"
                    value={tempSubpointText}
                    onChange={(e) => setTempSubpointText(e.target.value)}
                    className="edit-input nodrag"
                    autoFocus
                  />
                  <button
                    onClick={() => saveSubpointEdit(index)}
                    className="save-button nodrag"
                  >
                    ✓
                  </button>
                </div>
              ) : (
                <div className="label-container">
                  <span className={`subpoint-text ${sp.crossed ? 'crossed' : ''}`}>
                    {sp.text}
                  </span>
                  {showTranslations && sp.translation && (
                    <span className="translation"> ({sp.translation})</span>
                  )}
                </div>
              )}
              <div className="subpoint-buttons">
                <button
                  onClick={toggleSubpointCrossed(index)}
                  className="cross-button nodrag"
                >
                  {sp.crossed ? '✓' : '✕'}
                </button>
                <button
                  onClick={() => startEditingSubpoint(index)}
                  className="edit-button nodrag"
                >
                  ✎
                </button>
                <button
                  onClick={() => removeSubpoint(index)}
                  className="remove-button nodrag"
                >
                  ×
                </button>
              </div>
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