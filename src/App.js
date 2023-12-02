import Layout from "./components/Layout/Layout";
import "react-notifications/lib/notifications.css";
import { NotificationContainer } from "react-notifications";
import { ScriptProvider } from "./components/Context/ScriptContext";
import { GlobalProvider } from "./components/GlobalContext/GlobalContext";
function App() {
  return (
    <>
    <GlobalProvider>
      <ScriptProvider>
        <Layout />
        <NotificationContainer />
      </ScriptProvider>
    </GlobalProvider>
    </>
  );
}
export default App;
