import { useCallback, useState, useEffect, useContext, useRef } from "react";
import { Spinner, Button } from "reactstrap";
import { Spin } from "antd";
import ModalChatTrial from "../components/Node/ModalChatTrial";
import ModalSetting from "../components/Node/ModalSetting";
import { BASE_URL } from "../global/globalVar";
import uniqueID from "../functionHelper/GenerateID";
import { GET, POST } from "../functionHelper/APIFunction";
import { ScriptContext } from "../components/Context/ScriptContext";
import ReactFlow, {
  MiniMap,
  Controls,
  addEdge,
  ReactFlowProvider,
  useReactFlow,
  useNodesState,
  useEdgesState,
  useNodes,
} from "reactflow";
import { useNavigate } from "react-router-dom";
import NodeLayout from "../components/Node/NodeLayout";
import StartNode from "../components/Node/StartNode";
import CustomEdge from "../components/Node/ButtonEdge";
import "./css/Flow.css";
import "reactflow/dist/style.css";
import { NotificationManager } from "react-notifications";
const nodeTypes = {
  nodeLayout: NodeLayout,
  startNode: StartNode,
};
const edgeType = {
  buttonedge: CustomEdge,
};

const rfStyle = {
  backgroundColor: "#f5f6fa",
};

const initialNode = [
  {
    id: "STARTNODE",
    type: "startNode",
    position: {
      x: 20,
      y: 400,
    },
    data: {
      id: "STARTNODE",
      value: "STARTNODE",
      conditionMapping: [{}],
    },
  },
];

function Flow() {
  const navigate = useNavigate();
  const context = useContext(ScriptContext);
  const defaultEdgeOptions = { animated: true };
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNode);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, isLoading] = useState(true);
  const [openChat, setOpenChat] = useState(false);
  const [openSetting, setOpenSetting] = useState(false);
  const [intents, setIntents] = useState([]);
  const [wrongMsg, setWrongMsg] = useState("");
  const [endMessage, setEndMessage] = useState("");
  const [contextChild, setContextChild] = useState(context.value);
  const reactFlowInstance = useReactFlow();
  const connectingNode = useRef(null);
  const connecting = useRef(null);
  const reactFlowWrapper = useRef(null);
  useEffect(() => {
    if (contextChild.id !== "") {
      Promise.all([
        GET(BASE_URL + "api/intent/get_all/by_user_id"),
        GET(BASE_URL + "api/script/get/" + context.value.id),
      ])
        .then((res) => {
          isLoading(false);
          setIntents(res[0].intents);
          setWrongMsg(res[1].wrong_message);
          setEndMessage(res[1].end_message);
          let data = nodeObject(res[1].nodes, res[0].intents);
          setNodes((nodes) => [...nodes, ...data.lstNode]);
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

  const saveScript = useCallback(
    (nodes) => {
      let body = {
        id: contextChild.id,
        name: contextChild.name,
        wrong_message: wrongMsg,
        end_message: endMessage,
        nodes: nodes,
      };
      let url = contextChild.id === "" ? "api/script/add" : "api/script/update";
      POST(BASE_URL + url, JSON.stringify(body))
        .then((res) => {
          if (res.http_status === "OK") {
            setContextChild({ id: res.script.id, name: res.script.name });
            context.setValue({ id: res.script.id, name: res.script.name });
            NotificationManager.success("Update successfully", "Success");
          } else {
            throw res.exception_code;
          }
        })
        .catch((err) => {
          NotificationManager.error(err, "Error");
        });
    },
    [wrongMsg, endMessage, contextChild]
  );

  const nodeObject = (nodes, intents) => {
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
          isFirst: node.is_first_node ? node.is_first_node : false,
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
      if (node.is_first_node === true) {
        setNodes((nds) =>
          nds.map((item) => {
            if (item.id === "STARTNODE") {
              item.data.conditionMapping[0].target = node.node_id;
              return item;
            }
            return item;
          })
        );
        lstEdge.push({
          id: uniqueID(),
          source: "STARTNODE",
          target: node.node_id,
          type: "buttonedge",
          data: {
            delete: handleDeleteEdge,
          },
        });
      }
    });
    return { lstNode, lstEdge };
  };

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
    console.log("Save", lstNode);

    let startNodeID = lstNode.filter(
      (node) => node.data.value === "STARTNODE"
    )[0].data.conditionMapping[0].target;

    lstNode = lstNode.filter((node) => node.id !== "STARTNODE");

    let lstSaveObj = lstNode.map((node) => {
      return {
        node_id: node.id,
        message: node.data.value,
        is_first_node: node.id === startNodeID ? true : false,
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
  const closeModalSetting = () => {
    setOpenSetting(!openSetting);
  };
  const handleWrongMsg = (wrongMsg, endMsg) => {
    setWrongMsg(wrongMsg);
    setEndMessage(endMsg);
  };
  const onConnect = useCallback((params) => {
    connecting.state = true;
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
  const onConnectStart = useCallback((_, node) => {
    connecting.state = false;
    connectingNode.currentNode = node;
  }, []);
  const onConnectEnd = useCallback((event) => {
    if (connecting.state === false) {
      let data = nodeObject(
        [
          {
            node_id: uniqueID(),
            message: "",
            position: [event.clientX, event.clientY - 130],
            condition_mappings: [],
          },
        ],
        intents
      );
      reactFlowInstance.addNodes(data.lstNode[0]);
      let newEdg = {
        id: connectingNode.currentNode.handleId,
        source: connectingNode.currentNode.nodeId,
        sourceHandle: connectingNode.currentNode.handleId,
        target: data.lstNode[0].id,
        type: "buttonedge",
        data: {
          delete: handleDeleteEdge,
          nodeID: connectingNode.currentNode.nodeId,
          sourceHandle: connectingNode.currentNode.handleId,
        },
      };
      setEdges((eds) => [...eds, newEdg]);

      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === connectingNode.currentNode.nodeId) {
            node.data.conditionMapping.forEach((cdn) => {
              if (cdn.id === connectingNode.currentNode.handleId) {
                cdn.next_node_ids = [data.lstNode[0].id];
                cdn.target = data.lstNode[0].id;
              }
            });
            return node;
          }
          return node;
        })
      );
    }
  }, []);
  const handleEditScriptName = (value) => {
    contextChild.name = value;
  };

  return (
    <div style={{ height: "92vh" }}>
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
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
      >
        <MiniMap />
        <Controls />
      </ReactFlow>
      <div className="script-toolbar-container">
        <div className="script-toolbar">
          <div className="left-bar">
            <div
              className="btn-back"
              onClick={() => {
                navigate("/dashboard");
              }}
            >
              <i className="fa-solid fa-arrow-left"></i>
            </div>
            <div
              className="script-title"
              onClick={() => {
                setOpenSetting(!openSetting);
              }}
            >
              <span className="title">{contextChild.name}</span>
              <i className="fa-regular fa-newspaper"></i>
            </div>
            <div
              className="script-title"
              onClick={() => {
                setOpenChat(!openChat);
              }}
            >
              <span className="title">Try script</span>
              <i class="fa-solid fa-comment-dots"></i>
            </div>
          </div>
          <div className="right-bar">
            <Button
              onClick={handleCreateNode}
              className="btn-add"
              disabled={loading}
            >
              <i class="fa-regular fa-square-plus"></i> Create node
            </Button>
            <Button
              onClick={handleSaveScript}
              className="btn-save"
              disabled={loading}
            >
              <i className="fa-regular fa-floppy-disk"></i> Update
            </Button>
          </div>
        </div>
      </div>
      <Spin
        size="large"
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
      <ModalSetting
        open={openSetting}
        closeModalSetting={closeModalSetting}
        message={wrongMsg}
        messageEnd={endMessage}
        setMsg={handleWrongMsg}
        scriptName={contextChild.name}
        handleEditScriptName={handleEditScriptName}
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
