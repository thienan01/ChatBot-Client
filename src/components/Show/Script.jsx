import { Button, Table, Modal, Input, Form, Space } from "antd";
import { useState, useEffect } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { nanoid } from "@reduxjs/toolkit";
import AddForm from "./AddForm";

function Script() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState(null);

  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const showAdd = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:3001/scripts");
      const responseJSON = await response.json();

      setDataSource(responseJSON);
    };
    fetchData();
  }, []);

  const [addFormData, setAddFormData] = useState({
    name: "",
    code: "",
  });

  const handleAddFormChange = (event) => {
    event.preventDefault();

    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;

    setAddFormData(newFormData);
  };

  const handleAddFormSubmit = (event) => {
    event.preventDefault();

    const newData = {
      id: nanoid(),
      name: addFormData.name,
      code: addFormData.code,
    };

    const newDatas = [...dataSource, newData];
    setDataSource(newDatas);
    handleCancel();
  };

  const columns = [
    {
      key: "2",
      title: "Name",
      dataIndex: "name",
    },
    {
      key: "3",
      title: "Code",
      dataIndex: "code",
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
  };
  const resetEditing = () => {
    setIsEditing(false);
    setEditingData(null);
  };
  return (
    <div className="Script">
      <header className="Script-header">
        <Button
          onClick={showAdd}
          className="btn btn-success"
          data-toggle="modal"
        >
          <i className="ri-add-circle-fill"></i> <span> Create </span>
        </Button>
        <br />
        <br />

        <Table columns={columns} dataSource={dataSource}></Table>
        <Modal
          title="Edit Data"
          visible={isEditing}
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
            <Input
              value={editingData?.code}
              onChange={(e) => {
                setEditingData((pre) => {
                  return { ...pre, code: e.target.value };
                });
              }}
            />
          </Space.Compact>

          <br />
        </Modal>

        <Modal
          title="Add Data"
          visible={visible}
          okText="Save"
          onCancel={handleCancel}
          onOk={handleAddFormSubmit}
        >
          <AddForm handleAddFormChange={handleAddFormChange} />
        </Modal>
      </header>
    </div>
  );
}

export default Script;
