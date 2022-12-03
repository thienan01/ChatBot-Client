import { Button, Table, Modal, Input, Form, Space} from "antd";
import { useState, useEffect, useRef } from "react";
import { EditOutlined, DeleteOutlined, SearchOutlined} from "@ant-design/icons";
import {GET, POST} from '../../functionHelper/APIFunction'
import uniqueID from "../../functionHelper/GenerateID";
import AddFormPattern from "./AddFormPattern";
import Highlighter from 'react-highlight-words';
import Progressbar from "./Progessbar";


function Pattern() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState(null);


  const checkStatus = () => {
    GET(`https://chatbot-vapt.herokuapp.com/api/training/get_server_status`)
    .then((res) => {
      setDataCheck(res.http_status);
      setDataCheck(res.status);
      console.log(res.http_status)
      console.log(res.status)
    })
  }
    
  
  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const showAdd = () => {
    setVisible(true)
  }
  const showPro = () => {
    setVisible1(true)
    checkStatus()
  }

  
  const handleCancel = () => {
    setVisible(false)
    form.resetFields()
  };
  const handleCancel1 = () => {
    setVisible1(false)

  };
  const [dataSource, setDataSource] = useState([]);
  const [dataCheck, setDataCheck] = useState([]);


  const fetchRecords = () => {
    setLoading(true);
    GET(`https://chatbot-vapt.herokuapp.com/api/pattern/get_pagination/by_user_id?page=2&size=10`)
      .then((res) => {
        setDataSource(res.items);
        setLoading(false);
        console.log(res.patterns)
      })
  };

  useEffect(() => {
    fetchRecords(1);  
    checkStatus()
  }, [])


  const [addFormData, setAddFormData] = useState({
    id: uniqueID,
    intent_id: "",
    content: "",
  });
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

  const handleAddFormChange = (event) => {
    event.preventDefault();
    const fieldName = event.target.getAttribute("name");
    const fieldValue = event.target.value;

    const newFormData = { ...addFormData };
    newFormData[fieldName] = fieldValue;

    setAddFormData(newFormData);
  };

  function createData(data) {
    POST(`https://chatbot-vapt.herokuapp.com/api/pattern/add`, JSON.stringify(data))
    .then(response => {
      console.log(response)
      return response.payload()})
  }
  const handleAddFormSubmit = (event) => {
    event.preventDefault();


    const newData = {
      intent_id: addFormData.intent_id,
      content: addFormData.content,
    };

    const newDatas = [...dataSource, newData];
    setDataSource(newDatas);
    createData(newData, function(){
      fetchRecords(1);
    });
    handleCancel();
  };
  const columnsCheck = [
    {
      key: "1",
      title: "HTTP Status",
      dataIndex: "http_status",
    },
    {
        key: "2",
        title: "Status",
        dataIndex: "status",
      },
    ]
  const columns = [
    {
      key: "1",
      title: "Intent ID",
      dataIndex: "intent_id",
      ...getColumnSearchProps('intent_id'),
    },
    {
        key: "2",
        title: "content",
        dataIndex: "content",
        ...getColumnSearchProps('content'),
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
      <Button onClick={showAdd} className="btn btn-success" data-toggle="modal"><i className="ri-add-circle-fill"></i> <span> Create </span></Button>
      <Button onClick={showPro} className="btn btn-success" 
      style={{
        float: 'right',
        backgroundColor: '#006CBE'
      }}
      ><i class="ri-checkbox-circle-fill"></i><span> Check </span></Button>

        <Table 
        loading={loading}
        columns={columns}
         dataSource={dataSource}
         rowKey="id"
         pagination={{
          pageSize: 10,
          total: 6000,
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
           <h5>Content</h5>

          <Input
            value={editingData?.content}
            onChange={(e) => {
              setEditingData((pre) => {
                return { ...pre, content: e.target.value };
              });
            }}
          />
          </Space.Compact>
          <br />
          <br />
            <h5>Intent ID</h5>

          <Space.Compact block>
          <Input
            value={editingData?.intent_id}
            onChange={(e) => {
              setEditingData((pre) => {
                return {...pre, intent_id: e.intent_id};
              });
            }}
          />
          </Space.Compact>
          
          <br />
  
        </Modal>
        
       <Modal
          title="Add Data"
          open={visible}
          okText="Save"
          onCancel={handleCancel}
          onOk={() => 
            handleAddFormSubmit
          }
          
        >
          <AddFormPattern
          handleAddFormChange={handleAddFormChange}
          />
            <h5>Intent ID</h5>

          <Space.Compact block>
          <Input
            value={editingData?.intent_id}
            onChange={(e) => {
              setEditingData((pre) => {
                return {...pre, intent_id: e.intent_id};
              });
            }}
          />
          </Space.Compact>
        </Modal>

        <Modal
        title="Check Status"
        open={visible1}
        onCancel={handleCancel1}
        onOk={checkStatus}
        >
          <Progressbar
          />
          <Table
          columns={columnsCheck}
          dataSource={dataCheck}
          rowKey="id"
          >
          </Table>
        </Modal>
        



      </header>
    </div>
  );
}

export default Pattern;