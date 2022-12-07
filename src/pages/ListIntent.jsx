import React from "react";
import {
  DesktopOutlined,
  UnorderedListOutlined,
  TeamOutlined,
  WechatOutlined,
  BarcodeOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { useNavigate } from "react-router-dom";
import Intent from "../components/Show/Intent";
import IntentTable from "../components/Show/IntentTable";
import Helmet from "../components/Helmet/Helmet.js";
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
  getItem("Chatbot Service", "/home", <DesktopOutlined />),
  getItem("List Intent", "/listintent", <WechatOutlined />),
  getItem("List Pattern", "/listpattern", <UnorderedListOutlined />),
  getItem("List Script", "/listscript", <BarcodeOutlined />),
  getItem("Team", "sub2", <TeamOutlined />, [
    getItem("Team 1", "6"),
    getItem("Team 2", "8"),
  ]),
];
const ListIntent = () => {
  const navigate = useNavigate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <Helmet title="List Intent">
      <Layout>
        <Layout>
          <Sider
            width={200}
            style={{
              background: colorBgContainer,
            }}
          >
            <Menu
              onClick={({ key }) => {
                navigate(key);
              }}
              mode="inline"
              defaultSelectedKeys={["/listintent"]}
              defaultOpenKeys={["/listintent"]}
              style={{
                height: "100%",
                borderRight: 0,
              }}
              items={items2}
            ></Menu>
          </Sider>
          <Layout
            style={{
              padding: "0 24px 24px",
            }}
          >
            <Breadcrumb
              style={{
                margin: "16px 0",
              }}
            >
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>List</Breadcrumb.Item>
              <Breadcrumb.Item>App</Breadcrumb.Item>
            </Breadcrumb>
            <Content
              style={{
                padding: 14,
                margin: 0,
                minHeight: 280,
                background: colorBgContainer,
              }}
            >
              {/* <Intent /> */}
              <IntentTable />
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </Helmet>
  );
};

export default ListIntent;
