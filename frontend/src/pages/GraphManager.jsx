import { useEffect, useState } from "react";
import api from "../auth/api.js";
import CreateGraphPage from "./CreateGraphPage";
import '../assets/WordSets.css';

const GraphManager = () => {
    const [graphs, setGraphs] = useState([]);
    const [graphName, setGraphName] = useState("");
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);
    const [error, setError] = useState(null);
    const [mode, setMode] = useState(0); // 0: list, 1: create, 2: edit
    const [currentID, setCurrentID] = useState(-1);

    useEffect(() => {
        async function fetchGraphs() {
            try {
                const response = await api.get('/api/user/graph/');
                if (response.status === 200) {
                    setGraphs(response.data);
                }
            } catch (err) {
                console.log(err);
                setError("Error loading your graphs");
            }
        }
        fetchGraphs();
    }, []);

    async function deleteGraph(id) {
        try {
            const response = await api.delete('/api/user/graph/' + id + '/');
            if (response.status === 200 || response.status === 204) {
                setGraphs(graphs.filter(graph => graph.id !== id));
                if (currentID === id) {
                    setMode(0);
                    setCurrentID(-1);
                }
            }
        } catch (err) {
            console.log("DELETE ERROR:", err);
            setError("Error deleting graph");
        }
    }

    async function saveGraph() {
        try {
            const graphData = {
                name: graphName,
                nodes: nodes,
                edges: edges
            };

            if (mode === 1) { // Create new
                const response = await api.post('/api/user/graph/', graphData);
                if (response.status === 201) {
                    setGraphs(prev => [...prev, response.data]);
                    setMode(0);
                }
            } else if (mode === 2) { // Update existing
                graphData.id = currentID;
                const response = await api.put('/api/user/graph/' + currentID + '/', graphData);
                if (response.status === 200) {
                    setGraphs(prev => prev.map(g => g.id === currentID ? response.data : g));
                    setMode(0);
                }
            }
        } catch (e) {
            console.error("Save error:", e);
            setError("Error saving graph");
        }
    }

    const selectGraph = (graph) => {
        setMode(2); // Edit mode
        setCurrentID(graph.id);
        setGraphName(graph.name);
        setNodes(graph.nodes || []);
        setEdges(graph.edges || []);
    };

    const createNewGraph = () => {
        setMode(1); // Create mode
        setGraphName("");
        setNodes([]);
        setEdges([]);
        setCurrentID(-1);
    };

    return (
        <div className="container">
            <div className='wordListsContainer'>
                <h3>Your Graphs</h3>
                <ul>
                    {graphs.map(graph => (
                        <li key={graph.id} onClick={() => selectGraph(graph)}>
                            <strong>{graph.name}</strong>
                            <div className="graphPreview">
                                {graph.nodes?.length || 0} nodes, {graph.edges?.length || 0} edges
                            </div>
                            <button onClick={(e) => {
                                e.stopPropagation();
                                deleteGraph(graph.id);
                            }}>X</button>
                        </li>
                    ))}
                    <li>
                        <button className="newGraphButton" onClick={createNewGraph}>
                            + New Graph
                        </button>
                    </li>
                </ul>
            </div>

            {mode > 0 ? (
                <div className="graphEditorContainer">
                    <div className="graphHeader">
                        <input
                            value={graphName}
                            onChange={(e) => setGraphName(e.target.value)}
                            type="text"
                            placeholder="Graph name"
                            className="graphNameInput"
                        />
                        <div className="graphActions">
                            <button onClick={saveGraph} className="saveButton">
                                Save Graph
                            </button>
                            <button onClick={() => setMode(0)} className="cancelButton">
                                Cancel
                            </button>
                        </div>
                    </div>
                    <CreateGraphPage
                        initialNodes={nodes}
                        initialEdges={edges}
                        onNodesChange={setNodes}
                        onEdgesChange={setEdges}
                    />
                </div>
            ) : (
                <div className="placeholder">
                    <p>Select a graph or create a new one</p>
                </div>
            )}
        </div>
    );
};

export default GraphManager;