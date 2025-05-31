import { useState, useCallback } from 'react';
import {ReactFlow, addEdge, applyEdgeChanges, applyNodeChanges, Background, Controls} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from './graphComponents/nodes/CustomNode.jsx';

const initialNodes = [
  {
    id: '1',
    type: 'customNode',
    position: { x: 100, y: 100 },
    data: {
      mainLabel: {
        text: 'Main Concept',
        translation: 'Concepto Principal',
        crossed: false
      },
      subpoints: [  // Ensure subpoints is always an array
        { text: 'Point 1', translation: 'Punto 1', crossed: false },
        { text: 'Point 2', translation: 'Punto 2', crossed: true },
        { text: 'Point 3', translation: 'Punto 3', crossed: false }
      ],
      images: [
        'https://cdn-icons-png.flaticon.com/256/5610/5610944.png',
        'https://cdn-icons-png.flaticon.com/256/0/619.png'
      ],
      showTranslations: false,
      showText: true,
      showImages: true
    }
  },
  // Add another node with minimal data to test
  {
    id: '2',
    type: 'customNode',
    position: { x: 400, y: 100 },
    data: {
      mainLabel: {
        text: 'Simple Node',
        crossed: false
      }
      // Omitted subpoints and images to test safe defaults
    }
  }
];

const nodeTypes = { customNode: CustomNode };

function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);

  const onNodesChange = useCallback(
    changes => setNodes(nds => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    changes => setEdges(eds => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    connection => setEdges(eds => addEdge(connection, eds)),
    []
  );

  return (
    <div style={{ height: '80vh', width: '80vh' }}>
      <ReactFlow
          colorMode="dark"
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background/>
        <Controls/>
          </ReactFlow>
    </div>
  );
}

export default Flow;