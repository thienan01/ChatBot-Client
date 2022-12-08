import React, { useState } from "react";
import {
  TeamOutlined,
  WechatOutlined,
  BarcodeOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import Footer from "../Footer/Footer";
import IntentTable from "../Show/IntentTable";
import ScriptTable from "../Show/ScriptTable";
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
  getItem("Script", "SCRIPT", <BarcodeOutlined />),
  getItem("Intent", "INTENT", <WechatOutlined />),
  getItem("Team", "sub2", <TeamOutlined />, [
    getItem("Team 1", "6"),
    getItem("Team 2", "8"),
  ]),
];
const App = () => {
  const [table, setTable] = useState("SCRIPT");
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <>
      <Layout>
        <Layout>
          <Sider
            width={300}
            style={{
              background: colorBgContainer,
              borderRadius: "10px",
            }}
            className="shadow"
          >
            <Menu
              onClick={({ key }) => {
                setTable(key);
              }}
              mode="inline"
              defaultSelectedKeys={["SCRIPT"]}
              defaultOpenKeys={["SCRIPT"]}
              style={{
                height: "90vh",
                borderRadius: "11px",
                padding: "4px",
              }}
              items={items2}
            ></Menu>
          </Sider>
          <Layout
            style={{
              padding: "0px 10px 0px 15px",
              background: "#f5f6fa",
            }}
          >
            {/* <Breadcrumb
            style={{
              margin: "16px 0",
            }}
          >
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb> */}
            <Content
              style={{
                padding: "14px 14px 0px 14px",
                margin: 0,
                height: "fit-content",
                background: colorBgContainer,
                flex: "none",
                borderRadius: "10px",
              }}
              className="shadow"
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
      </Layout>
      <Footer />
    </>
  );
};
export default App;
