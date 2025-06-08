import { useState, useCallback, useEffect } from 'react';
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
import CustomNode from './graphComponents/nodes/CustomNode.jsx';
import CustomEdge from './graphComponents/edges/CustomEdge.jsx';
import dagre from '@dagrejs/dagre';

const NODE_WIDTH = 300;
const NODE_HEIGHT = 200;
const nodeTypes = { customNode: CustomNode };
const edgeTypes = { customEdge: CustomEdge };

// Initialize Dagre graph
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  const isHorizontal = direction === 'LR';
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

function Flow() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);



  const transformResponseToGraph = (graphData) => {
    // Transform nodes
    const transformedNodes = graphData.nodes.map(node => ({
      id: node.id,
      type: 'customNode',
      position: { x: 0, y: 0 }, // Will be set by layout
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
        images: [],//node.image_description ? [node.image_description] : [],
        showTranslations: true,
        showText: true,
        showImages: true
      }
    }));



    // Transform edges
     const transformedEdges = graphData.edges.map((edge, index) => {
    const arrowType = edge.arrow_type || 'arrow'; // Default to arrow

    return {
      id: `e${index}-${edge.source}-${edge.target}`,
      source: edge.source,
      target: edge.target,
      type: 'customEdge',
      data: {
        label: edge.label,
        translation: edge.translation,
        arrowType: arrowType,
        showTranslation: true
      },
      // Add markerEnd based on arrowType
      markerEnd: arrowType !== 'none' ? {
        type: getMarkerType(arrowType),
        color: '#555',
        width: 20,
        height: 20
      } : undefined,
      animated: true
    };
  });




    // Apply layout
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
        showTranslation: true,
        arrowType: 'arrow' // Default to directed edge
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



     // Add helper function to get marker type
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
      const response = await fetch('http://localhost:8080/api/generate-graph/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      const graphData = await response.json();
      const { nodes: newNodes, edges: newEdges } = transformResponseToGraph(graphData);

      setNodes(newNodes);
      setEdges(newEdges);
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
    <div style={{ height: '95%', width: '100%', position: 'relative' }}>
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
          <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to generate graph"
              style={{ width: '300px', height: '80px', padding: '8px' }}
              disabled={isLoading}
            />
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              style={{ padding: '8px 16px', background: isLoading ? '#555' : '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              {isLoading ? 'Generating...' : 'Generate Graph'}
            </button>
          </div>
        </Panel>

        <Panel position="top-right" style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => onLayout('TB')} className="xy-theme__button">
            Vertical Layout
          </button>
          <button onClick={() => onLayout('LR')} className="xy-theme__button">
            Horizontal Layout
          </button>
        </Panel>

        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default Flow;