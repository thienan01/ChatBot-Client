import React, { useState } from "react";
import {
  TeamOutlined,
  TagsOutlined,
  MessageOutlined,
  FileSearchOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu } from "antd";
import Footer from "../Footer/Footer";
import IntentTable from "../Show/IntentTable";
import ScriptTable from "../Show/ScriptTable";
import "../../styles/sidebar.css";
import { Input } from "reactstrap";
const { Content, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items2 = [
  getItem("Scripts", "SCRIPT", <FileSearchOutlined />),
  getItem("Intents", "INTENT", <TagsOutlined />),
  getItem("Patterns", "PATTERN", <MessageOutlined />),
  getItem("Team", "sub2", <TeamOutlined />, [
    getItem("Team 1", "6"),
    getItem("Team 2", "8"),
  ]),
];
const App = () => {
  const [table, setTable] = useState("SCRIPT");
  // const {
  //   token: { colorBgContainer },
  // } = theme.useToken();
  return (
    <div style={{ background: "#f5f6fa" }}>
      <Layout style={{ margin: "0px 15%", background: "none" }}>
        <Sider width={250} style={{ background: "none", marginTop: "34px" }}>
          <div className="searchArea" id="searchArea">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input
              type="search"
              className="searchInput"
              placeholder="Search.."
              for="searchArea"
            />
          </div>
          <Menu
            onClick={({ key }) => {
              setTable(key);
            }}
            mode="inline"
            defaultSelectedKeys={["SCRIPT"]}
            defaultOpenKeys={["SCRIPT"]}
            style={{
              height: "90vh",
              borderInlineEnd: "none",
              background: "none",
              fontSize: "18px",
            }}
            items={items2}
          ></Menu>
        </Sider>

        <Layout
          style={{
            padding: "0px 10px 0px 25px",
            background: "none",
          }}
        >
          <Breadcrumb className="breadcrumb">
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Scripts</Breadcrumb.Item>
          </Breadcrumb>
          <Content
            style={{
              padding: "14px 14px 0px 0px",
              margin: 0,
              height: "fit-content",
              flex: "none",
              borderRadius: "10px",
            }}
          >
            {(() => {
              switch (table) {
                case "SCRIPT":
                  return <ScriptTable />;
                case "INTENT":
                  return <IntentTable />;
                  break;
                default:
                  return <div></div>;
              }
            })()}
          </Content>
        </Layout>
      </Layout>

      <Footer />
    </div>
  );
};
export default App;
