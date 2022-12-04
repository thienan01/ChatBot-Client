import { Button, Table, Modal, Input, Form, Space} from "antd";
import { useState, useEffect, useRef } from "react";
import { EditOutlined, DeleteOutlined, SearchOutlined} from "@ant-design/icons";
import {GET, POST} from '../../functionHelper/APIFunction'
import uniqueID from "../../functionHelper/GenerateID";
import AddFormPattern from "./AddFormPattern";
import Highlighter from 'react-highlight-words';
import { BASE_URL_LOCAL } from '../../global/globalVar'



function Pattern() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState(null);


 
    
  
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const showAdd = () => {
    setVisible(true)
  }
  

  
  const handleCancel = () => {
    setVisible(false)
    form.resetFields()
  };
  
  const [dataSource, setDataSource] = useState([]);


  const fetchRecords = () => {
    setLoading(true);
    GET(BASE_URL_LOCAL +`/api/pattern/get_pagination/by_user_id?page=2&size=10`)
      .then((res) => {
        setDataSource(res.items);
        setLoading(false);
        console.log(res.patterns)
      })
  };

  useEffect(() => {
    fetchRecords(1);  
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
          placeholder="intent id"
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

        
        



      </header>
    </div>
  );
}

export default Pattern;