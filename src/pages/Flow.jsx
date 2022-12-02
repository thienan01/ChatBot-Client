import { useCallback, useState, useEffect } from "react";
import { Spinner, Button } from "reactstrap";
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
  const [intents, setIntents] = useState([]);
  const reactFlowInstance = useReactFlow();

  useEffect(() => {
    if (true) {
      Promise.all([
        GET(BASE_URL + "api/intent/get_all/by_user_id"),
        GET(BASE_URL + "api/node?script_id=6385c673e327384e29b96744"),
      ])
        .then((res) => {
          console.log("res", res);
          isLoading(false);
          setIntents(res[0].intents);
          let data = nodeObject(res[1].nodes, res[0].intents);
          console.log("fi", data);
          setNodes(data.lstNode);
          setEdges(data.lstEdge);
        })
        .catch((err) => {
          console.log(err);
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
    let body = {
      id: "6385c673e327384e29b96744",
      name: "new script pos",
      nodes: nodes,
    };
    console.log("post", body);

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
    console.log("lst", reactFlowInstance.getNodes());

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
    console.log(reactFlowInstance.getNodes());
    setEdges((eds) => eds.filter((e) => e.id !== id));
  }, []);

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
      <div>
        <Button
          onClick={handleCreateNode}
          className="btn-success"
          style={{
            position: "relative",
            top: "-45px",
            left: "50%",
            transform: "translateX(-50%)",
            marginRight: "10px",
          }}
        >
          <i className="fa-solid fa-plus"></i> Add
        </Button>
        <Button
          onClick={handleSaveScript}
          color="primary"
          style={{
            position: "relative",
            top: "-45px",
            left: "50%",
            transform: "translateX(-50%)",
            marginLeft: "10px",
          }}
        >
          <i className="fa-regular fa-floppy-disk"></i> Save
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
