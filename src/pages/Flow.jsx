import { useCallback, useState, useEffect, useMemo } from "react";
import $ from "jquery";
import { GET, POST } from "../functionHelper/APIFunction";
import ReactFlow, {
  MiniMap,
  Controls,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  ReactFlowProvider,
  useReactFlow,
  useNodes,
} from "reactflow";
import NodeLayout from "../components/Node/NodeLayout";
import CustomEdge from "../components/Node/ButtonEdge";
import FormModal from "../components/Modal/FormModal";
import "reactflow/dist/style.css";

const initialNodes = [];
const initialEdges = [];
let lstIntent = [];
const nodeTypes = {
  nodeLayout: NodeLayout,
};
const edgeType = {
  buttonedge: CustomEdge,
};

const rfStyle = {
  backgroundColor: "#f5f6fa",
};

let nodeId = 0;
const data = {
  username: "admin",
  password: "123456",
};
function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const reactFlowInstance = useReactFlow();
  useEffect(() => {
    Promise.all([
      GET("https://chatbot-vapt.herokuapp.com/api/intent"),
      GET(
        "https://chatbot-vapt.herokuapp.com/api/node?script_id=637b7d9b4e532158d255a434"
      ),
    ])
      .then((res) => {
        lstIntent = res[0].intents;
        res[1].nodes.forEach((item) => {
          const newNode = {
            id: item.id,
            type: "nodeLayout",
            position: {
              x: Math.random() * 500,
              y: Math.random() * 500,
            },
            data: {
              id: item.id,
              value: item.message,
              intents: res[0].intents,
              conditionMapping: item.condition_mappings,
              delete: handleDeleteNode,
              openModal: handleOpenModal,
            },
          };
          reactFlowInstance.addNodes(newNode);
          item.condition_mappings.forEach((condition) => {
            if (condition.next_node_ids != null) {
              const newEdge = {
                id: condition.id,
                source: item.id,
                target: condition.next_node_ids[0],
                type: "buttonedge",
                data: { delete: handleDeleteEdge },
              };
              reactFlowInstance.addEdges(newEdge);
            }
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleCreateNode = useCallback(() => {
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
        value: "",
        intents: lstIntent,
        conditionMapping: [],
        delete: handleDeleteNode,
        openModal: handleOpenModal,
      },
    };
    reactFlowInstance.addNodes(newNode);
  }, []);

  const handleDeleteNode = useCallback((id) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
  }, []);
  const handleDeleteEdge = useCallback((id) => {
    alert(id);
    setEdges((eds) => eds.filter((e) => e.id !== id));
  }, []);

  const handleOpenModal = useCallback(() => {
    setIsOpenModal(!isOpenModal);
  }, []);

  const onNodesChange = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
    },
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
          { ...params, type: "buttonedge", data: { delete: handleDeleteEdge } },
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
      <FormModal
        isOpen={isOpenModal}
        onClick={() => {
          setIsOpenModal(!isOpenModal);
        }}
      />
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
