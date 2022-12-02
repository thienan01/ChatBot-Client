import { useCallback, useState, useEffect } from "react";
import { Spinner, Button } from "reactstrap";
import ModalChatTrial from "../components/Node/ModalChatTrial";
import { BASE_URL } from "../global/globalVar";
import uniqueID from "../functionHelper/GenerateID";
import { GET, POST } from "../functionHelper/APIFunction";
import ReactFlow, {
  MiniMap,
  Controls,
  addEdge,
  ReactFlowProvider,
  useReactFlow,
  useNodesState,
  useEdgesState,
} from "reactflow";
import NodeLayout from "../components/Node/NodeLayout";
import CustomEdge from "../components/Node/ButtonEdge";
import "reactflow/dist/style.css";
import { NotificationManager } from "react-notifications";
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
  const defaultEdgeOptions = { animated: true };
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, isLoading] = useState(true);
  const [openChat, setOpenChat] = useState(false);
  const [intents, setIntents] = useState([]);
  const reactFlowInstance = useReactFlow();

  useEffect(() => {
    if (true) {
      Promise.all([
        GET(BASE_URL + "api/intent/get_all/by_user_id"),
        GET(BASE_URL + "api/node?script_id=6389d5a0769c2b2ed974bc26"),
      ])
        .then((res) => {
          isLoading(false);
          setIntents(res[0].intents);
          let data = nodeObject(res[1].nodes, res[0].intents);
          setNodes(data.lstNode);
          setEdges(data.lstEdge);
        })
        .catch((err) => {
          NotificationManager.error(
            "Error occur when loading script!",
            "Error"
          );
        });
    } else {
      GET(BASE_URL + "api/intent/get_all/by_user_id")
        .then((res) => {
          isLoading(false);
          if (res.http_status !== "OK") {
            throw res.exception_code;
          }
          setIntents(res.intents);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const saveScript = useCallback((nodes) => {
    nodes.reverse();
    let body = {
      id: "6389d5a0769c2b2ed974bc26",
      name: "Script mua xe",
      nodes: nodes,
    };
    POST(BASE_URL + "api/script/update", JSON.stringify(body))
      .then((res) => {
        NotificationManager.success("Update successfully", "Success");
      })
      .catch((err) => {
        NotificationManager.error("Update failure", "Error");
      });
  }, []);

  const nodeObject = useCallback((nodes, intents) => {
    let lstNode = [];
    let lstEdge = [];
    nodes.forEach((node) => {
      node.condition_mappings.forEach((cnd) => {
        cnd.target = cnd.next_node_ids[0];
      });
      lstNode.push({
        id: node.node_id,
        type: "nodeLayout",
        position: {
          x: node.position[0],
          y: node.position[1],
        },
        data: {
          id: node.node_id,
          value: node.message,
          intents: intents,
          conditionMapping: node.condition_mappings,
          delete: handleDeleteNode,
        },
      });

      node.condition_mappings.forEach((condition) => {
        if (condition.next_node_ids != null) {
          lstEdge.push({
            id: condition.id,
            source: node.node_id,
            sourceHandle: condition.id,
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
          node_id: uniqueID(),
          message: "",
          position: [Math.random() * 500, Math.random() * 500],
          condition_mappings: [],
        },
      ],
      intents
    );
    reactFlowInstance.addNodes(data.lstNode[0]);
  };

  const handleSaveScript = () => {
    let lstNode = reactFlowInstance.getNodes();
    let lstSaveObj = lstNode.map((node) => {
      return {
        node_id: node.id,
        message: node.data.value,
        position: [node.position.x, node.position.y],
        condition_mappings: node.data.conditionMapping.map((condition) => {
          return {
            next_node_ids: [condition.target],
            intent_id: condition.intent_id ? condition.intent_id : "",
            predict_type: condition.predict_type,
            keyword: condition.keyword ? condition.keyword : "",
          };
        }),
      };
    });

    saveScript(lstSaveObj);
  };

  const handleDeleteNode = useCallback((id) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
  }, []);

  const handleDeleteEdge = useCallback((id, nodeID, sourceHandle) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeID) {
          node.data.conditionMapping.forEach((condition) => {
            if (condition.sourceHandle === sourceHandle) {
              delete condition.source;
              delete condition.sourceHandle;
              delete condition.target;
            }
          });
        }
        return node;
      })
    );
    setEdges((eds) => eds.filter((e) => e.id !== id));
  }, []);

  const closeModal = () => {
    setOpenChat(!openChat);
  };
  const onConnect = useCallback((params) => {
    setEdges((eds) =>
      addEdge(
        {
          ...params,
          type: "buttonedge",
          data: {
            delete: handleDeleteEdge,
            nodeID: params.source,
            sourceHandle: params.sourceHandle,
          },
        },
        eds
      )
    );
  }, []);

  return (
    <div style={{ height: "95vh" }}>
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
      <div
        className="shadow bg-white"
        style={{
          textAlign: "center",
          position: "relative",
          top: "-68px",
          left: "50%",
          transform: "translateX(-50%)",
          marginLeft: "10px",
          width: "400px",
          padding: "10px",
          marginBottom: "10px",
          borderRadius: "10px",
        }}
      >
        <Button
          onClick={handleCreateNode}
          className="btn-success"
          style={{ margin: "0px 3px", width: "90px" }}
        >
          <i className="fa-solid fa-plus"></i> Add
        </Button>
        <Button
          onClick={handleSaveScript}
          color="primary"
          style={{ margin: "0px 3px", width: "90px" }}
        >
          <i className="fa-regular fa-floppy-disk"></i> Save
        </Button>
        <Button
          color="warning"
          style={{ margin: "0px 3px", width: "90px" }}
          onClick={() => {
            setOpenChat(!openChat);
          }}
        >
          <i className="fa-regular fa-square-caret-left"></i> Try
        </Button>
      </div>
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
      <ModalChatTrial openChat={openChat} closeModal={closeModal} />
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
