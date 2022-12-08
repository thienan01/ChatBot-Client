import Layout from "./components/Layout/Layout";
import "react-notifications/lib/notifications.css";
import { NotificationContainer } from "react-notifications";
import { ScriptProvider } from "./components/Context/ScriptContext";
function App() {
  return (
    <>
      <ScriptProvider>
        <Layout />
        <NotificationContainer />
      </ScriptProvider>
    </>
  );
}
export default App;
