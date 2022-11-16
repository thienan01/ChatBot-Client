import { useCallback, useState } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";
import TextUpdaterNode from "../components/Node/TextUpdaterNode";
import NodeLayout from "../components/Node/NodeLayout";
import CustomEdge from "../components/Node/ButtonEdge";
import "reactflow/dist/style.css";

const initialNodes = [
  {
    id: "1",
    type: "nodeLayout",
    position: { x: 90, y: 90 },
    data: { value: 123, id: "1" },
  },
];

const initialEdges = [];
const nodeTypes = {
  textUpdater: TextUpdaterNode,
  nodeLayout: NodeLayout,
};
const edgeType = {
  buttonedge: CustomEdge,
};

const rfStyle = {
  backgroundColor: "#f5f6fa",
};

let nodeId = 0;

function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const reactFlowInstance = useReactFlow();
  const handleCreateNode = useCallback(() => {
    console.log(reactFlowInstance);
    const id = `${++nodeId}`;
    const newNode = {
      id,
      type: "nodeLayout",
      position: {
        x: 500,
        y: 180,
      },
      data: {
        id,
        label: `Node ${id}`,
        delete: deleteNode,
      },
    };
    reactFlowInstance.addNodes(newNode);
  }, [reactFlowInstance]);

  const deleteNode = useCallback((id) => {
    console.log(id);
    setNodes((nds) => nds.filter((node) => node.id !== id));
  }, []);

  const deleteEdge = useCallback((id) => {
    setEdges((eds) => eds.filter((e) => e.id !== id));
  }, []);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          { ...params, type: "buttonedge", data: { delete: deleteEdge } },
          eds
        )
      ),
    []
  );
  const defaultEdgeOptions = { animated: true };

  return (
    <div style={{ height: "90vh" }}>
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        defaultEdgeOptions={defaultEdgeOptions}
        nodeTypes={nodeTypes}
        edgeTypes={edgeType}
        style={rfStyle}
      >
        <MiniMap />
        <Controls />
      </ReactFlow>
      <button
        onClick={handleCreateNode}
        className="btn-add"
        style={{ position: "relative", top: "-45px", left: "45px" }}
      >
        add node
      </button>
    </div>
  );
}

function FlowContainer() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
export default FlowContainer;
