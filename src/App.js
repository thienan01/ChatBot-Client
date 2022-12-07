import Layout from "./components/Layout/Layout";
import { MantineProvider } from "@mantine/core";
import "react-notifications/lib/notifications.css";
import { NotificationContainer } from "react-notifications";
function App() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Layout />
      <NotificationContainer />
    </MantineProvider>
  );
}
export default App;
