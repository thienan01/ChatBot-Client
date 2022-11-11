import Rete from "rete";
import ReactRenderPlugin from "rete-react-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import ContextMenuPlugin from "rete-context-menu-plugin";
import AreaPlugin from "rete-area-plugin";
import { MyNode } from "./Node";
import { MyControl } from "./Control";

var numSocket = new Rete.Socket("Connect");

class AddComponent extends Rete.Component {
  constructor() {
    super("The Script");
  }

  builder(node) {
    var inp = new Rete.Input("num1", "", numSocket);
    var out = new Rete.Output("num", "", numSocket);
    var ctrl = new MyControl(this.editor, "greeting", "#write your intent");

    return node
      .addInput(inp)
      .addOutput(out)
      .addControl(ctrl);
  }

  worker(node, inputs, outputs) {
    console.log(node.data.Input);
  }
}

export default async function foo(container) {
  console.log(container);
  var components = [new AddComponent()];

  var editor = new Rete.NodeEditor("demo@0.1.0", container);
  editor.use(ConnectionPlugin);
  editor.use(ReactRenderPlugin, {
    component: MyNode
  });
  editor.use(ContextMenuPlugin);

  var engine = new Rete.Engine("demo@0.1.0");

  components.map(c => {
    editor.register(c);
    engine.register(c);
  });

  editor.on(
    "process nodecreated noderemoved connectioncreated connectionremoved",
    async () => {
      console.log("process");
      await engine.abort();
      await engine.process(editor.toJSON());
    }
  );

  editor.fromJSON({
    id: "demo@0.1.0",
    nodes: {
      "1": {
        id: 1,
        data: {},
        inputs: { num1: { connections: [] } },
        outputs: {
          num: { connections: [{ node: 2, input: "num1", data: {} }] }
        },
        position: [-285.5, -105.375],
        name: "The Script"
      },
    //   "2": {
    //     id: 2,
    //     data: {},
    //     inputs: {
    //       num1: { connections: [{ node: 1, output: "num", data: {} }] }
    //     },
    //     outputs: { num: { connections: [] } },
    //     position: [-16.5, -99.375],
    //     name: "Add"
    //   }
    }
  });

  editor.view.resize();
  AreaPlugin.zoomAt(editor);
  editor.trigger("process");
}
