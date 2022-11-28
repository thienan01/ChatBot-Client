import { useCallback, useState, useEffect } from "react";
import { Spinner } from "reactstrap";
import { BASE_URL } from "../global/globalVar";
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
  useNodesState,
  useEdgesState,
} from "reactflow";
import NodeLayout from "../components/Node/NodeLayout";
import CustomEdge from "../components/Node/ButtonEdge";
import "reactflow/dist/style.css";
import { param } from "jquery";

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
        GET(BASE_URL + "api/node?script_id=637b7d9b4e532158d255a434"),
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
          id: uniqueID(),
          message: "",
          condition_mappings: [],
        },
      ],
      intents
    );
    reactFlowInstance.addNodes(data.lstNode[0]);
  };
  const handleSaveScript = () => {
    let all = reactFlowInstance.toObject();
    console.log("all", all);

    let lstNode = all.nodes.map((node) => {
      return {
        id: node.id,
        message: node.data.value,
        conditionMapping: node.data.conditionMapping,
        position: node.position,
      };
    });

    let lstEdge = all.edges.map((eds) => {
      let edges = [];
      all.edges.forEach((edsIn) => {
        if (eds.source === edsIn.source) {
          edges.push(edsIn);
        }
      });
      return edges;
    });

    let lstSaveObj = [];
    lstNode.forEach((node) => {
      lstEdge.forEach((eds) => {
        if (node.id === eds.nodeSrc) {
          lstSaveObj.push({});
        }
      });
    });
    console.log("lst", lstSaveObj);
    console.log("newarr", lstNode);
  };

  const handleDeleteNode = useCallback((id) => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
  }, []);

  const handleDeleteEdge = useCallback((id, nodeID, sourceHandle) => {
    console.log("node", nodeID);
    console.log("handle", sourceHandle);
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
      <button
        onClick={handleCreateNode}
        className="btn-add"
        style={{ position: "relative", top: "-45px", left: "45px" }}
      >
        add node
      </button>
      <button
        onClick={handleSaveScript}
        className="btn-add"
        style={{ position: "relative", top: "-45px", left: "45px" }}
      >
        update
      </button>
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
