import { useCallback, useState, useEffect } from "react";
import { Spinner } from "reactstrap";
import uniqueID from "../functionHelper/GenerateID";
import { GET } from "../functionHelper/APIFunction";
import ReactFlow, {
  MiniMap,
  Controls,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";
import NodeLayout from "../components/Node/NodeLayout";
import CustomEdge from "../components/Node/ButtonEdge";
import FormModal from "../components/Modal/FormModal";
import "reactflow/dist/style.css";

const initialNodes = [];
const initialEdges = [];
const nodeTypes = {
  nodeLayout: NodeLayout,
};
const edgeType = {
  buttonedge: CustomEdge,
};

const rfStyle = {
  backgroundColor: "#f5f6fa",
};

function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [loading, isLoading] = useState(true);
  const [intents, setIntents] = useState([]);
  const reactFlowInstance = useReactFlow();

  useEffect(() => {
    Promise.all([
      GET("https://chatbot-vapt.herokuapp.com/api/intent"),
      GET(
        "https://chatbot-vapt.herokuapp.com/api/node?script_id=637b7d9b4e532158d255a434"
      ),
    ])
      .then((res) => {
        isLoading(false);
        setIntents(res[0].intents);
        let data = nodeObject(res[1].nodes, res[0].intents);
        setNodes(data.lstNode);
        setEdges(data.lstEdge);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const nodeObject = useCallback((nodes, intents) => {
    let lstNode = [];
    let lstEdge = [];
    nodes.forEach((node) => {
      lstNode.push({
        id: node.id,
        type: "nodeLayout",
        position: {
          x: Math.random() * 500,
          y: Math.random() * 500,
        },
        data: {
          id: node.id,
          value: node.message,
          intents: intents,
          conditionMapping: node.condition_mappings,
          delete: handleDeleteNode,
          openModal: handleOpenModal,
        },
      });

      node.condition_mappings.forEach((condition) => {
        if (condition.next_node_ids != null) {
          lstEdge.push({
            id: condition.id,
            source: node.id,
            target: condition.next_node_ids[0],
            type: "buttonedge",
            data: { delete: handleDeleteEdge },
          });
        }
      });
    });
    return { lstNode, lstEdge };
  });

  const handleCreateNode = () => {
    let data = nodeObject(
      [
        {
          id: uniqueID().toString(),
          message: "",
          condition_mappings: [{ id: "1", intent_id: null }],
        },
      ],
      intents
    );
    reactFlowInstance.addNodes(data.lstNode[0]);
    let all = reactFlowInstance.toObject();
    console.log("all", all);
    let newNodeLst = all.nodes.map((node) => {
      return {
        id: node.id,
        message: node.data.value,
        conditionMapping: node.data.conditionMapping,
        position: node.position,
      };
    });
    let lstSaveObj = [];
    newNodeLst.forEach((node) => {
      if (all.edges.length > 0) {
        all.edges.forEach((eds) => {
          if (node.id === eds.source) {
            lstSaveObj.push({
              id: node.id,
              message: node.message,
              condition_mapping: [
                {
                  intent_id: node.conditionMapping[0].intent_id,
                  next_node_ids: [eds.target],
                },
              ],
            });
          } else {
            lstSaveObj.push({
              id: node.id,
              message: node.message,
              condition_mapping: [
                {
                  intent_id: node.conditionMapping[0].intent_id,
                },
              ],
            });
          }
        });
      } else {
        lstSaveObj.push({
          id: node.id,
          message: node.message,
          condition_mapping: [
            {
              intent_id: node.conditionMapping[0].intent_id,
            },
          ],
        });
      }
    });
    console.log("lst", lstSaveObj);
    console.log("newarr", newNodeLst);
  };

  const handleDeleteNode = useCallback((id) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
  }, []);
  const handleDeleteEdge = useCallback((id) => {
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
      <Spinner
        animation="border"
        variant="primary"
        className="text-primary"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          display: loading ? "block" : "none",
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
