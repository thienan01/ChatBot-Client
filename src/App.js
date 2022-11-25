import Layout from "./components/Layout/Layout";
import {MantineProvider} from '@mantine/core';

function App() {
  return (
  <MantineProvider withGlobalStyles withNormalizeCSS>
    <Layout/>
  </MantineProvider>
  )
}
export default App;
