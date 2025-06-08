import { useCallback, useState, useEffect } from 'react';
import { Handle, Position, NodeToolbar, useReactFlow } from '@xyflow/react';

const CustomNode = ({ id, data, setDraggable }) => {
  const { setNodes } = useReactFlow();
  const [editingMain, setEditingMain] = useState(false);
  const [editingMainTranslation, setEditingMainTranslation] = useState(false);
  const [editingSubpoint, setEditingSubpoint] = useState(null);
  const [editingSubpointTranslation, setEditingSubpointTranslation] = useState(null);

  // Temporary state for editing
  const [tempMainText, setTempMainText] = useState('');
  const [tempMainTranslation, setTempMainTranslation] = useState('');
  const [tempSubpointText, setTempSubpointText] = useState('');
  const [tempSubpointTranslation, setTempSubpointTranslation] = useState('');

  // Provide safe defaults for all properties
  const safeData = {
    mainLabel: data.mainLabel || { text: '', translation: '', crossed: false },
    subpoints: data.subpoints || [],
    images: data.images || [],
    showTranslations: data.showTranslations !== undefined ? data.showTranslations : true,
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

  // Disable dragging when editing
  useEffect(() => {
    if (setDraggable) {
      const isEditing = editingMain || editingMainTranslation ||
                       editingSubpoint !== null || editingSubpointTranslation !== null;
      setDraggable(!isEditing);
    }
  }, [editingMain, editingMainTranslation, editingSubpoint, editingSubpointTranslation, setDraggable]);

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

  // Main label handlers
  const startEditingMain = () => {
    setTempMainText(mainLabel.text);
    setEditingMain(true);
  };

  const startEditingMainTranslation = () => {
    setTempMainTranslation(mainLabel.translation);
    setEditingMainTranslation(true);
  };

  const saveMainEdit = () => {
    updateNodeData({
      mainLabel: {
        ...mainLabel,
        text: tempMainText,
        translation: tempMainTranslation
      }
    });
    setEditingMain(false);
    setEditingMainTranslation(false);
  };

  // Subpoint handlers
  const startEditingSubpoint = (index) => {
    setTempSubpointText(subpoints[index].text);
    setTempSubpointTranslation(subpoints[index].translation);
    setEditingSubpoint(index);
  };

  const startEditingSubpointTranslation = (index) => {
    setTempSubpointTranslation(subpoints[index].translation);
    setEditingSubpointTranslation(index);
  };

  const saveSubpointEdit = (index) => {
    const updatedSubpoints = [...subpoints];
    updatedSubpoints[index] = {
      ...updatedSubpoints[index],
      text: tempSubpointText,
      translation: tempSubpointTranslation
    };
    updateNodeData({ subpoints: updatedSubpoints });
    setEditingSubpoint(null);
    setEditingSubpointTranslation(null);
  };

  // Add a new subpoint with both text and translation
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

  // Toggle handlers
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
          {/* Main Label Section */}
          <div className="main-label-row">
            {editingMain ? (
              <div className="edit-container">
                <input
                  type="text"
                  value={tempMainText}
                  onChange={(e) => setTempMainText(e.target.value)}
                  className="edit-input nodrag"
                  placeholder="German text"
                  autoFocus
                />
                {showTranslations && (
                  <input
                    type="text"
                    value={tempMainTranslation}
                    onChange={(e) => setTempMainTranslation(e.target.value)}
                    className="edit-input nodrag"
                    placeholder="Translation"
                  />
                )}
                <div className="edit-buttons">
                  <button
                    onClick={saveMainEdit}
                    className="save-button nodrag"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => {
                      setEditingMain(false);
                      setEditingMainTranslation(false);
                    }}
                    className="cancel-button nodrag"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <div className="label-container">
                <span
                  className={`main-label-text ${mainLabel.crossed ? 'crossed' : ''}`}
                  onDoubleClick={startEditingMain}
                >
                  {mainLabel.text}
                </span>
                {showTranslations && mainLabel.translation && (
                  <span
                    className="translation"
                    onDoubleClick={startEditingMainTranslation}
                  >
                    {mainLabel.translation}
                  </span>
                )}
              </div>
            )}
            <div className="main-buttons">
              <button
                onClick={toggleMainLabelCrossed}
                className="cross-button nodrag"
                title="Toggle crossed"
              >
                {mainLabel.crossed ? '✓' : '✕'}
              </button>
              <button
                onClick={startEditingMain}
                className="edit-button nodrag"
                title="Edit"
              >
                ✎
              </button>
            </div>
          </div>

          {/* Subpoints Section */}
          {subpoints.map((sp, index) => (
            <div key={index} className="subpoint-row">
              {editingSubpoint === index ? (
                <div className="edit-container">
                  <input
                    type="text"
                    value={tempSubpointText}
                    onChange={(e) => setTempSubpointText(e.target.value)}
                    className="edit-input nodrag"
                    placeholder="German text"
                    autoFocus
                  />
                  {showTranslations && (
                    <input
                      type="text"
                      value={tempSubpointTranslation}
                      onChange={(e) => setTempSubpointTranslation(e.target.value)}
                      className="edit-input nodrag"
                      placeholder="Translation"
                    />
                  )}
                  <div className="edit-buttons">
                    <button
                      onClick={() => saveSubpointEdit(index)}
                      className="save-button nodrag"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => {
                        setEditingSubpoint(null);
                        setEditingSubpointTranslation(null);
                      }}
                      className="cancel-button nodrag"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <div className="label-container">
                  <span
                    className={`subpoint-text ${sp.crossed ? 'crossed' : ''}`}
                    onDoubleClick={() => startEditingSubpoint(index)}
                  >
                    {sp.text}
                  </span>
                  {showTranslations && sp.translation && (
                    <span
                      className="translation"
                      onDoubleClick={() => startEditingSubpointTranslation(index)}
                    >
                      {sp.translation}
                    </span>
                  )}
                </div>
              )}
              <div className="subpoint-buttons">
                <button
                  onClick={toggleSubpointCrossed(index)}
                  className="cross-button nodrag"
                  title="Toggle crossed"
                >
                  {sp.crossed ? '✓' : '✕'}
                </button>
                <button
                  onClick={() => startEditingSubpoint(index)}
                  className="edit-button nodrag"
                  title="Edit"
                >
                  ✎
                </button>
                <button
                  onClick={() => removeSubpoint(index)}
                  className="remove-button nodrag"
                  title="Remove"
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