import { Button, Table, Modal, Input, Form, Space, notification, Spin} from "antd";
import { useState, useEffect, useRef } from "react";
import { EditOutlined, DeleteOutlined, SaveOutlined, EyeOutlined, SearchOutlined} from "@ant-design/icons";
import Highlighter from 'react-highlight-words';
import AddForm from "./AddForm";
import {GET, POST} from '../../functionHelper/APIFunction'
import uniqueID1 from "../../functionHelper/GenerateID";
import uniqueID from "../../functionHelper/GenerateID";
import AddFormPattern from "./AddFormPattern";
import { BASE_URL_LOCAL } from '../../global/globalVar'



function Intent() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [isEditingPattern, setIsEditingPattern] = useState(false);
  const [editingDataPattern, setEditingDataPattern] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPattern, setIsPattern] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [form] = Form.useForm();
  const showAdd = () => {
    setVisible(true)
  }
  const showAddPattern = () => {
    setVisible1(true)
  }

  
  const handleCancel = () => {
    setVisible(false)
    form.resetFields()
  };
  const handleCancel1 = () =>{
    setIsPattern(false)
  }
  const handleCancel2 = () => {
    setVisible1(false)
  };

  const [dataSource, setDataSource] = useState([]);
  const [dataSource1, setDataSource1] = useState([]);

  const fetchRecords = (page) => {
    setLoading(true);
    GET(BASE_URL_LOCAL + `/api/intent/get_pagination/by_user_id?page=${page}&size=10`)
      .then((res) => {
        setDataSource(res.items);
        setLoading(false);
      })
  };
  const fetchPattern = (page) => {
    setLoading1(true);
    GET(BASE_URL_LOCAL +`/api/pattern/get_all/by_intent_id/${editingData?.id}`)
        .then((res) => {
          setDataSource1(res.patterns);
          setLoading1(false);
          console.log(res.patterns)
        })
  }
  function Wait5s() {
    setInterval(checkStatus, 1000);
  }
  const checkStatus = () => {
    GET(BASE_URL_LOCAL + `/api/training/get_server_status`)
    .then((res) => {
    console.log(res.status)
      if (res.status === "BUSY"){
        openNotificationBUSY()
        console.log(res.status)
      }
      else if (res.status === "FREE"){
        clearInterval(Wait5s)
      }
    })
  }
  useEffect(() => {
    fetchRecords(1);
  }, [])

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const key = "updatable";

    const [api, contextHolder] = notification.useNotification();
    const openNotificationBUSY = () => {
      api.open({
        key,
        message: "Notification",
        description: "Server training. Please wait!",
        icon: <Spin size="large" style={{ color: '#108ee9' }} />,
        duration: 0,
      });
      setTimeout(() => {
        api.open({
          key,
          message: "Notification",
          description: "Server training. Please wait!",
        icon: <Spin size="large" style={{ color: '#108ee9' }} />,
          duration: 0,
        });
      }, 0);
    };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });


  const [addFormData, setAddFormData] = useState({
    name: "",
    code: "",
  });
  const [addFormDataPattern, setAddFormDataPattern] = useState({
    intent_id: "",
    content: "",
  });
  const handleAddFormChangePattern = (event) => {
    event.preventDefault();
    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormDataPattern = { ...addFormDataPattern };
    newFormDataPattern[fieldName] = fieldValue;

    setAddFormDataPattern(newFormDataPattern);
  };

  const createDataPattern = (data) => {
    POST( BASE_URL_LOCAL + `/api/pattern/add`, JSON.stringify(data))
    .then(response => {
      console.log(response)
      return response.payload
    })
    .then(data => this.setDataSource1(data.id))
  }
  const handleAddFormSubmitPattern = (event) => {
    event.preventDefault();
    const newData = {
      id: uniqueID1,
      intent_id: addFormDataPattern.intent_id,
      content: addFormDataPattern.content,
    };
    const newDatas = [...dataSource1, newData];
    setDataSource1(newDatas);
    createDataPattern(newData, function(){
      fetchPattern();
    });
    handleCancel();
  };
  const handleAddFormChange = (event) => {
    event.preventDefault();
    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;


    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;

    setAddFormData(newFormData);
  };

  const createData = (data) => {
    POST( BASE_URL_LOCAL + `/api/intent/add`, JSON.stringify(data))
    .then(response => {
      console.log(response)
      return response.payload
    })
    .then(data => this.setDataSource(data.id))
  }

  const updateData = (data) => {
    POST(BASE_URL_LOCAL + `/api/intent/update`, JSON.stringify(data))
    .then(response => {
      console.log(response)
      return response.payload})
    .then(data => this.setDataSource(data.id))
  }
  const updateDataPattern = (data) => {
    POST(BASE_URL_LOCAL + `/api/pattern/update`, JSON.stringify(data))
    .then(response => {
      console.log(response)
      return response.payload})
    .then(data => this.setDataSource1(data.id))
  }

  const handleAddFormSubmit = async (event) => {
    event.preventDefault();

    const newData = {
      id: uniqueID,
      name: addFormData.name,
      code: addFormData.code,
    };
    console.log(newData.id)
    const newDatas = [...dataSource, newData];
    setDataSource(newDatas);
    createData(newData, function(){
      fetchRecords(1);
    });
    handleCancel();
  };
  const columns = [
    {
      key: "1",
      title: "ID",
      dataIndex: "id",
      ...getColumnSearchProps('id'),
    },
    {
      key: "1",
      title: "Name",
      dataIndex: "name",
      ...getColumnSearchProps('name'),
    },
    {
      key: "2",
      title: "Code",
      dataIndex: "code",
      ...getColumnSearchProps('code'),
    },
    {
      key: "3",
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
                onDeleteData(record)
                //onDeleteData1(record)
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
            <SaveOutlined 
            onClick={() =>{
              updateData(record, function(){
                fetchRecords(1);
              })
            }}
            style={{ color: "blue", marginLeft: 12 }}
            />
            <EyeOutlined
            onClick={() =>{
              onViewData(record)
              Wait5s()
              checkStatus()
              console.log(record.id)
            }}
            style={{ color: "blue", marginLeft: 12 }}
            />
            
          </>
        );
      },
    },
  ];
  const columnsPattern = [
    {
      key: "1",
      title: "Content",
      dataIndex: "content",
      ...getColumnSearchProps('content'),
    },
    {
      key: "2",
      title: "Content ID",
      dataIndex: "id",
      ...getColumnSearchProps('id'),
    },
    {
      key: "4",
      title: "Actions",
      render: (record) => {
        return (
          <>
            <EditOutlined
              onClick={() => {
                onEditDataPattern(record);
              }}
            />
            <DeleteOutlined
              onClick={() => {
                onDeleteDataPattern(record);
              }}
              style={{ color: "red", marginLeft: 12 }}
            />
            <SaveOutlined 
            onClick={() =>{
              updateDataPattern(record, function(){
                fetchPattern();
              })
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
  const onDeleteDataPattern = (record) => {
    Modal.confirm({
      title: "Are you sure, you want to delete this Data record?",
      okText: "Yes",
      okType: "danger",
      onOk: () => {
        setDataSource1((pre) => {
          return pre.filter((data) => data.id !== record.id);
        });
      },
    });
  };

  const onViewData = (record) => {
    fetchPattern()
    setIsPattern(true);
    setEditingData({ ...record });
  };


  const onEditData = (record) => {
    setIsEditing(true);
    setEditingData({ ...record });
    updateData(record, function(){
      fetchRecords(1);
    })
  };

  const onEditDataPattern = (record) => {
    setIsEditingPattern(true);
    setEditingDataPattern({ ...record });
    updateDataPattern(record, function(){
      fetchPattern();
    })
  };
  
  const resetEditing = () => {
    setIsEditing(false);
    setEditingData(null);
  };
  const resetEditingPattern = () => {
    setIsEditingPattern(false);
    setEditingDataPattern(null);
  };
  return (
    <div className="Script">
      <header className="Script-header">
      <Button onClick={showAdd} className="btn btn-success" data-toggle="modal"><i className="ri-add-circle-fill"></i> <span> Create </span></Button>
      <br />
      <br />
        <Table
        loading={loading}
        columns={columns}
         dataSource={dataSource}
         rowKey="id"
         pagination={{
          pageSize: 5,
          total: 1000,
          onChange: (page) => {
            fetchRecords(page);
          },
        }}
        ></Table>
        <Modal
          title="Edit Data"
          open={isEditing}
          okText="Confirm"
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
          }
        }
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
          title="Edit Data"
          open={isEditingPattern}
          okText="Confirm"
          onCancel={() => {
            resetEditingPattern();
          }}
          onOk={() => {
            setDataSource1((pre) => {
              return pre.map((data) => {
                if (data.id === editingDataPattern.id) {
                  return editingDataPattern;
                } else {
                  return data;
                }
              });

            });
            resetEditingPattern();
          }
        }
        >
          <br />
          <Space.Compact block>
          <Input
            value={editingDataPattern?.content}
            onChange={(e) => {
              setEditingDataPattern((pre) => {
                return { ...pre, content: e.target.value };
              });
            }}
          />
          </Space.Compact> 
          <br />
        </Modal>

       <Modal
          forceRender
          title="Add Data"
          open={visible}
          okText="Confirm"
          onCancel={handleCancel}
          onOk={handleAddFormSubmit}
        >
          <AddForm
          handleAddFormChange={handleAddFormChange}
          />
        </Modal>

        <Modal
          title="Add Data"
          open={visible1}
          okText="Save"
          onCancel={handleCancel2}
          onOk={handleAddFormSubmitPattern}  
        >
          <AddFormPattern
          handleAddFormChange={handleAddFormChangePattern}
          />
            <h5>Intent ID</h5>

          <Space.Compact block>
          <Input
            value={editingData?.id}
            onChange={(e) => {
              setEditingData((pre) => {
                return {...pre, id: e.id};
              });
            }}
          />
          </Space.Compact>
        </Modal>

        <Modal
          title={editingData?.name}
          open={isPattern}
          width={1000}
          onCancel={() => {
            handleCancel1();
          }}
          okButtonProps={{
            style: {
              display: "none",
            },
          }}
        >
          <br />

        {contextHolder}
      <Button onClick={showAddPattern} className="btn btn-success" data-toggle="modal"><i className="ri-add-circle-fill"></i> <span> Create </span></Button>
        <Table 
        loading={loading1}
        columns={columnsPattern}
         dataSource={dataSource1}
         rowKey="id"
         pagination={{
          pageSize: 5,
          total: 2000,
        }}
         ></Table>
        </Modal>


      </header>
    </div>
  );
}

export default Intent;