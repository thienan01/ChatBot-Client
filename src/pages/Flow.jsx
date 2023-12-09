import { useCallback, useState, useEffect, useContext, useRef } from "react";
import { Button } from "reactstrap";
import { Spin } from "antd";
import ModalChatTrial from "../components/Node/ModalChatTrial";
import ModalSetting from "../components/Node/ModalSetting";
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
} from "reactflow";
import { useNavigate, useParams } from "react-router-dom";
import NodeLayout from "../components/Node/NodeLayout";
import StartNode from "../components/Node/StartNode";
import CustomEdge from "../components/Node/ButtonEdge";
import "./css/Flow.css";
import "reactflow/dist/style.css";
import { NotificationManager } from "react-notifications";
import ChatHistoryModal from "../components/Modal/ChatHistoryModal";
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
  const { id } = useParams();
  const navigate = useNavigate();
  const context = useContext(ScriptContext);
  const defaultEdgeOptions = { animated: true };
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNode);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, isLoading] = useState(true);
  const [openChat, setOpenChat] = useState(false);
  const [openChatHistory, setOpenChatHistory] = useState(false);
  const [openSetting, setOpenSetting] = useState(false);
  const [intents, setIntents] = useState([]);
  const [entityType, setEntityType] = useState([]);
  const [wrongMsg, setWrongMsg] = useState("");
  const [endMessage, setEndMessage] = useState("");
  const [scriptId, setScriptId] = useState(id);
  const [scriptName, setScriptName] = useState(context.value.name);
  const reactFlowInstance = useReactFlow();
  const connectingNode = useRef(null);
  const connecting = useRef(null);
  useEffect(() => {
    if (id !== "new") {
      Promise.all([
        GET(process.env.REACT_APP_BASE_URL + "api/intent/get_all/by_user_id"),
        GET(process.env.REACT_APP_BASE_URL + "api/script/get/" + scriptId),
        POST(
          process.env.REACT_APP_BASE_URL + "api/entity_type/",
          JSON.stringify({ page: 1, size: 100 })
        ),
      ])
        .then((res) => {
          isLoading(false);
          setIntents(res[0].intents);
          setEntityType(res[2].items);
          setWrongMsg(res[1].wrong_message);
          setEndMessage(res[1].end_message);
          setScriptName(res[1].name);
          let data = nodeObject(res[1].nodes, res[0].intents, res[2].items);
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
      Promise.all([
        GET(process.env.REACT_APP_BASE_URL + "api/intent/get_all/by_user_id"),
        POST(
          process.env.REACT_APP_BASE_URL + "api/entity_type/",
          JSON.stringify({ page: 1, size: 100 })
        ),
      ])
        .then((res) => {
          isLoading(false);
          if (res[0].http_status !== "OK" || res[1].http_status !== "OK") {
            throw res.exception_code;
          }
          setIntents(res[0].intents);
          setEntityType(res[1].items);
        })
        .catch((err) => {
          console.log(err);
          NotificationManager.error("Some things went wrong!!", "Error");
        });
    }
  }, []);

  const saveScript = useCallback(
    (nodes) => {
      let body = {
        id: scriptId,
        name: scriptName,
        wrong_message: wrongMsg,
        end_message: endMessage,
        nodes: nodes,
      };
      let url = scriptId === "new" ? "api/script/add" : "api/script/update";
      POST(process.env.REACT_APP_BASE_URL + url, JSON.stringify(body))
        .then((res) => {
          isLoading(false);
          if (res.http_status === "OK") {
            setScriptId(res.script.id);
            setScriptName(res.script.name);
            NotificationManager.success("Update successfully", "Success");
          } else {
            throw res.exception_code;
          }
        })
        .catch((err) => {
          isLoading(false);
          NotificationManager.error(err, "Error");
        });
    },
    [wrongMsg, endMessage, scriptId, scriptName]
  );

  const nodeObject = (nodes, intents, entityType) => {
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
          entityType: entityType,
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
      intents,
      entityType
    );
    reactFlowInstance.addNodes(data.lstNode[0]);
  };

  const handleSaveScript = () => {
    isLoading(true);
    let lstNode = reactFlowInstance.getNodes();

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
  const onConnectEnd = useCallback(
    (event) => {
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
          intents,
          entityType
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
    },
    [intents]
  );
  const handleEditScriptName = (value) => {
    setScriptName(value);
  };
  const handleToggleChatHistory = () => {
    setOpenChatHistory((preState) => !preState);
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
              <span className="title">{scriptName}</span>
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
            <div
              className="script-title"
              onClick={() => {
                setOpenChatHistory(!openChatHistory);
              }}
            >
              <span className="title">History</span>
              <i class="fa-solid fa-clock-rotate-left"></i>
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
        scriptName={scriptName}
        handleEditScriptName={handleEditScriptName}
      />
      {openChatHistory ? (
        <ChatHistoryModal
          open={openChatHistory}
          toggle={handleToggleChatHistory}
          scriptId={scriptId}
          entityType={entityType}
        />
      ) : (
        <></>
      )}
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
