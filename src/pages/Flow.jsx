import { useCallback,useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  addEdge, 
  applyEdgeChanges, 
  applyNodeChanges,
  ReactFlowProvider,
  useReactFlow
} from 'reactflow';
import TextUpdaterNode from '../components/Node/TextUpdaterNode'
// 👇 you need to import the reactflow styles
import 'reactflow/dist/style.css';

const initialNodes = [
  { id: '1',type:'textUpdater', position: { x: 0, y: 0 }, data: { value: 123 } },
  { id: '2',type:'textUpdater', position: { x: 0, y: 100 }, data: { label: '2' } },
  { id: '3',type:'textUpdater', position: { x: 0, y:200 }, data: { label: 'test' } },
  { id: '4',type:'textUpdater', position: { x: 0, y: 300 }, data: { label: '3' } },
];

const initialEdges = [
];
const nodeTypes = { textUpdater: TextUpdaterNode };

const rfStyle = {
  backgroundColor: '#F8F8F8',
};

let nodeId = 0;

function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  // const reactFlowInstance = useReactFlow();
  // const onClick = useCallback(() => {
  //   const id = `${++nodeId}`;
  //   const newNode = {
  //     id,
  //     position: {
  //       x: Math.random() * 500,
  //       y: Math.random() * 500,
  //     },
  //     data: {
  //       label: `Node ${id}`,
  //     },
  //   };
  //   reactFlowInstance.addNodes(newNode);
  // }, []);
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );
  const defaultEdgeOptions = { animated: true };

  return (
    <div style={{ height: '90vh' }}>
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        defaultEdgeOptions={defaultEdgeOptions}
        nodeTypes={nodeTypes}
        style={rfStyle}
      >
        <MiniMap />
      <Controls />
      </ReactFlow>
    </div>
  );
}

export default Flow