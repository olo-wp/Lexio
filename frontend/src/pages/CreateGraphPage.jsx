import { useState, useCallback, useEffect, useRef } from 'react';

import {
  ReactFlow,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  Panel,
  useNodesState,
  useEdgesState,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import * as htmlToImage from 'html-to-image';
import CustomNode from '../components/graph/nodes/CustomNode.jsx';
import CustomEdge from '../components/graph/edges/CustomEdge.jsx';
import dagre from '@dagrejs/dagre';

import api from "../auth/api.js";

const NODE_WIDTH = 300;
const NODE_HEIGHT = 200;
const nodeTypes = { customNode: CustomNode };
const edgeTypes = { customEdge: CustomEdge };

const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  const isHorizontal = direction === 'LR';
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach(node => {
    dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  edges.forEach(edge => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return nodes.map(node => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: isHorizontal ? 'left' : 'top',
      sourcePosition: isHorizontal ? 'right' : 'bottom',
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2
      }
    };
  });
};

const CreateGraphPage = ({
  initialNodes = [],
  initialEdges = [],
  generationText = "",
  setGenerationText,
  onNodesChange: externalNodesChange,
  onEdgesChange: externalEdgesChange
}) => {
  const reactFlowWrapper = useRef(null);
  const [text, setText] = useState(generationText);
  const [isLoading, setIsLoading] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isInputCollapsed, setIsInputCollapsed] = useState(false);


  const addNewNode = useCallback(() => {
    const newNodeId = `node_${Date.now()}`;

    // Calculate position at center of viewport


    const newNode = {
      id: newNodeId,
      type: 'customNode',
      position: { x: 400, y: 300 },
      data: {
        mainLabel: {
          text: 'New Node',
          translation: '',
          crossed: false
        },
        subpoints: [],
        images: [],
        showTranslations: false,
        showText: true,
        showImages: true
      }
    };

    setNodes(nds => [...nds, newNode]);
  });

  // Sync internal state with external changes
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges]);

  // Notify parent of changes
  useEffect(() => {
    externalNodesChange(nodes);
  }, [nodes]);

  useEffect(() => {
    externalEdgesChange(edges);
  }, [edges]);
   useEffect(() => {
    setText(generationText);
  }, [generationText]);

  const onDownloadImage = useCallback(() => {
    if (!reactFlowWrapper.current) return;

    const flowElement = reactFlowWrapper.current.querySelector('.react-flow');

    htmlToImage.toPng(flowElement, {
      backgroundColor: '#1a365d',
      filter: (node) => {
        // we don't want to add the minimap and controls to the image
        if (
          node?.classList?.contains('react-flow__minimap') ||
          node?.classList?.contains('react-flow__controls') ||
          node?.classList?.contains('react-flow__panel')
        ) {
          return false;
        }

        return true;
      },
    })
    .then((dataUrl) => {
      const link = document.createElement('a');
      link.download = 'graph.png';
      link.href = dataUrl;
      link.click();
    })
    .catch((err) => {
      console.error('Error downloading image:', err);
    });
  }, []);

  const transformResponseToGraph = (graphData) => {
    const transformedNodes = graphData.nodes.map(node => ({
      id: node.id,
      type: 'customNode',
      position: { x: 0, y: 0 },
      data: {
        mainLabel: {
          text: node.main_label,
          translation: node.translation,
          crossed: node.crossed
        },
        subpoints: node.subpoints.map(sub => ({
          text: sub.text,
          translation: sub.translation,
          crossed: sub.crossed
        })),
        images: [],
        showTranslations: false,
        showText: true,
        showImages: true
      }
    }));

    const transformedEdges = graphData.edges.map((edge, index) => {
      const arrowType = edge.arrow_type || 'arrow';

      return {
        id: `e${index}-${edge.source}-${edge.target}`,
        source: edge.source,
        target: edge.target,
        type: 'customEdge',
        data: {
          label: edge.label,
          translation: edge.translation,
          arrowType: arrowType,
          showTranslation: false
        },
        markerEnd: arrowType !== 'none' ? {
          type: getMarkerType(arrowType),
          color: '#555',
          width: 20,
          height: 20
        } : undefined,
        animated: true
      };
    });

    const layoutedNodes = getLayoutedElements(transformedNodes, transformedEdges);
    return { nodes: layoutedNodes, edges: transformedEdges };
  };

  const onConnect = useCallback(
    connection => {
      const newEdge = {
        ...connection,
        type: 'customEdge',
        id: `e${Date.now()}`,
        data: {
          label: 'New Connection',
          translation: '',
          showTranslation: false,
          arrowType: 'arrow'
        },
        markerEnd: {
          type: MarkerType.Arrow,
          color: '#555',
          width: 20,
          height: 20
        },
        animated: true
      };
      setEdges(eds => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const getMarkerType = (arrowType) => {
    switch(arrowType) {
      case 'arrow':
        return MarkerType.Arrow;
      case 'arrowclosed':
        return MarkerType.ArrowClosed;
      default:
        return MarkerType.Arrow;
    }
  };

  const handleSubmit = async () => {
    if (!text.trim()) return;

    setIsLoading(true);
    try {
      const response = await api.post('/api/generate-graph/', { text });
      const graphData = await response.data;
      const { nodes: newNodes, edges: newEdges } = transformResponseToGraph(graphData);
      setNodes(newNodes);
      setEdges(newEdges);
      setIsInputCollapsed(true); // Collapse after generation
      setGenerationText(text);
    } catch (error) {
      console.error('Error processing text:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onLayout = useCallback(
    (direction) => {
      const layoutedNodes = getLayoutedElements(nodes, edges, direction);
      setNodes([...layoutedNodes]);
    },
    [nodes, edges]
  );

  return (
    <div style={{ height: '600px', width: '100%', position: 'relative' }} ref={reactFlowWrapper}>
      <ReactFlow
        colorMode="dark"
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        <Panel position="top-left" style={{ background: 'rgba(0, 0, 0, 0.7)', padding: '10px', borderRadius: '5px' }}>
          {isInputCollapsed ? (
            <button
              onClick={() => setIsInputCollapsed(false)}
              style={{ padding: '8px 16px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              Show Input
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to generate graph"
                style={{ width: '300px', height: '80px', padding: '8px' }}
                disabled={isLoading}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  style={{ padding: '8px 16px', background: isLoading ? '#555' : '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                  {isLoading ? 'Generating...' : 'Generate Graph'}
                </button>
                <button
                  onClick={() => setIsInputCollapsed(true)}
                  disabled={isLoading}
                  style={{ padding: '8px 16px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
                >
                  Collapse
                </button>
              </div>
            </div>
          )}
        </Panel>

        <Panel position="top-right" style={{ display: 'flex', gap: '10px' }}>
          <button onClick={addNewNode} className="xy-theme__button" title="Add Node">
            + Node
          </button>
          <button onClick={() => onLayout('TB')} className="xy-theme__button">
            V Layout
          </button>
          <button onClick={() => onLayout('LR')} className="xy-theme__button">
            H Layout
          </button>
          <button onClick={onDownloadImage} className="xy-theme__button">
            Download
          </button>
        </Panel>

        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default CreateGraphPage;