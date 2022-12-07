import { Table, Modal, Input, Space, Form, Typography} from "antd";
import { useState, useEffect } from "react";
import { EditOutlined, DeleteOutlined, EyeOutlined} from "@ant-design/icons";
import {GET, POST} from '../../functionHelper/APIFunction'
import { BASE_URL_LOCAL } from '../../global/globalVar'
import { getCookie } from "../../functionHelper/GetSetCookie";



function Script() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm();

 

  const { Paragraph } = Typography;
  const [dataSource, setDataSource] = useState([]);
  const [dataSource1, setDataSource1] = useState([]);
  const fetchRecords = (page) => {
    setLoading(true);
    GET(BASE_URL_LOCAL + `/api/script/get_pagination/by_user_id?page=${page}&size=5`)
      .then((res) => {
        setDataSource(res.items);
        setLoading(false);
      })
  };
  const fecthSecretKey = () => {
    setLoading1(true);
    GET(BASE_URL_LOCAL + `/api/user/get_secret_key`)
      .then((res) => {
        setDataSource1(res);
        setLoading1(false);
        console.log(res.secret_key)
      })
  }
  const handleCancel = () => {
    setVisible(false)
    form.resetFields()
  };

  const showScript = (record) => {
    fecthSecretKey()
    setVisible(true)
    console.log(getCookie.secretkey)
    setEditingData({...record})
  }

  useEffect(() => {
    fetchRecords(1)
    fecthSecretKey()
  }
  , [])

 
  const columns = [

    {
        key: "2",
        title: "ID",
        dataIndex: "id",
      },
    {
      key: "3",
      title: "Name",
      dataIndex: "name",
    },
    {
      key: "4",
      title: "Actions",
      render: (record) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                onEditData(record);
              }}
            />
            <DeleteOutlined
              onClick={() => {
                onDeleteData(record);
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
            <EyeOutlined
            onClick={() =>{
              showScript(record)
              console.log(record.id)
            }}
            style={{ color: "blue", marginLeft: 12 }}
            />
          </>
        );
      },
    },
  ];

 
  const onDeleteData = (record) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this Data record?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        setDataSource((pre) => {
          return pre.filter((data) => data.id !== record.id);
        });
      },
    });
  };

  const onEditData = (record) => {
    setIsEditing(true);
    setEditingData({ ...record });
    updateData(record, function(){
      fetchRecords(1);
    })
  };
  const updateData = (data) => {
    POST( BASE_URL_LOCAL + `/api/intent/update`, JSON.stringify(data))
    .then(response => {
      console.log(response)
      return response.payload()})
    .then(data => this.setDataSource(data.id))
  }
  const resetEditing = () => {
    setIsEditing(false);
    setEditingData(null);
  };
  return (
    <div className="Script">
      <header className="Script-header">
      <Table
        loading={loading}
        columns={columns}
         dataSource={dataSource}
         rowKey="id"
         pagination={{
          pageSize: 5,
          total: 100,
          onChange: (page) => {
            fetchRecords(page);
          },
        }}
        ></Table>
        <Modal
          title="Edit Data"
          open={isEditing}
          okText="Save"
          onCancel={() => {
            resetEditing();
          }}
          onOk={() => {
            setDataSource((pre) => {
              return pre.map((data) => {
                if (data.id === editingData.id) {
                  return editingData;
                } else {
                  return data;
                }
              });
            });
            resetEditing();
          }}
        >
          <br />
           <Space.Compact block>
          <Input
            value={editingData?.name}
            onChange={(e) => {
              setEditingData((pre) => {
                return { ...pre, name: e.target.value };
              });
            }}
          />
          </Space.Compact>
          <br />
          <br />
          <Space.Compact block>
          </Space.Compact>
          <br />
        </Modal>
        <Modal
          loading={loading1}
          title={"Copy the code below for your Website:"}
          open={visible}
          footer={null}
          width={800}
          okText="Ok"
          onCancel={handleCancel}
          className="modalStyle"
          dataSource={dataSource1}
          >
           <Paragraph copyable={{ tooltips: false }}>
          <span>&lt; script &gt;</span>
          <br />
           <span>&nbsp; &nbsp;var secretKey = "{dataSource1.secret_key}"; </span>
          <br />
           <span>&nbsp; &nbsp;var scriptId = "{editingData?.id}"; </span>
          <br />
           <span>&nbsp; &nbsp;var currentNodeId = "_BEGIN"; </span>
          <br />
          <span>&lt; script /&gt;</span>
            <br />
            <br />
          <span>&lt; div class="containerChat" &gt;</span>
          <br />
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&lt; div class="chatbox" &gt;</span>
          <br />
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt; div class="chatbox__support" &gt;</span>
          <br />
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt; div class="chatbox__header" &gt;</span>
          <br />
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt; div class="chatbox__content--header" &gt;</span>
          <br />
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt; h4 class="chatbox__heading--header" &gt; Chat support &lt; /h4 &gt;</span>
          <br />
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt; div/ &gt;</span>
          <br />
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt; div/ &gt;</span>
          <br />
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt; div class="chatbox__messages" &gt;</span>
          <br />
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt; div/ &gt;</span>
          <br />
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt; div class="chatbox__footer" &gt;</span>
          <br />
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt; img src="https://cdn.jsdelivr.net/gh/thienan01/ChatCDNs/emojis.svg" alt="" &gt;</span>
          <br />
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt; img src="https://cdn.jsdelivr.net/gh/thienan01/ChatCDNs/microphone.svg" alt="" &gt;</span>
          <br />
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt; input type="text" placeholder="Write a message..." id="inputMessage" &gt;</span>
          <br />
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt; p class="chatbox__send--footer" id="btnSend" onclick="handleSendMsg()"&gt;Send &lt;/p &gt; </span>
          <br />
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt; img src="https://cdn.jsdelivr.net/gh/thienan01/ChatCDNs/attachment.svg" alt="" &gt;</span>
          <br />
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt; /div &gt;</span>
          <br />
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt; /div &gt;</span>
          <br />
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt; div class="chatbox__button" &gt;</span>
          <br />
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt; button &gt; button &lt; /button &gt;</span>
          <br />
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt; /div &gt;</span>
          <br />
          <span>&nbsp;&nbsp;&nbsp;&nbsp;&lt; /div &gt;</span>
          <br />
          <span>&lt; /div &gt;</span>
          <br />
            <br />
          <span>&lt; link href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,300;0,400;0,600;1,300&display=swap" rel="stylesheet" &gt;</span>
          <br />
          <span>&lt; link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/thienan01/ChatCDNs/chat.css" &gt;</span>
          <br />
          <span>&lt; script src="https://code.jquery.com/jquery-1.10.2.min.js &gt; &lt; /script &gt;</span> 
          <br />
          <span>&lt; src="https://cdn.jsdelivr.net/gh/thienan01/ChatCDNs/handleChat.js" &gt; &lt; /script &gt;</span> 
          <br />
          </Paragraph>
        </Modal>
      </header>
    </div>
  );
}

export default Script;