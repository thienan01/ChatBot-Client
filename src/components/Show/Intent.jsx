import { Button, Table, Modal, Input, Form, Space} from "antd";
import { useState, useEffect, useRef } from "react";
import { EditOutlined, DeleteOutlined, SaveOutlined, EyeOutlined, SearchOutlined} from "@ant-design/icons";
import Highlighter from 'react-highlight-words';
import AddForm from "./AddForm";
import {DELETE, GET, POST} from '../../functionHelper/APIFunction'
import uniqueID from "../../functionHelper/GenerateID";
import { BASE_URL_LOCAL } from '../../global/globalVar'



function Intent() {
  const [isEditing, setIsEditing] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [isDeleteing, setIsDeleteing] = useState(false);
  const [deleteingData, setDeleteingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPattern, setIsPattern] = useState(false);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const showAdd = () => {
    setVisible(true)
  }

  
  const handleCancel = () => {
    setVisible(false)
    form.resetFields()
  };

  const [dataSource, setDataSource] = useState([]);

  const fetchRecords = (page) => {
    setLoading(true);
    GET(BASE_URL_LOCAL + `/api/intent/get_pagination/by_user_id?page=${page}&size=10`)
      .then((res) => {
        setDataSource(res.items);
        setLoading(false);
      })
  };
  useEffect(() => {
    fetchRecords(1);
    checkStatus()
    
  }, [])
  const checkStatus = () => {
    GET(BASE_URL_LOCAL + `/api/training/get_server_status`)
    .then((res) => {
      console.log(res)
    })
  }

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
  const deleteData = (data) => {
    DELETE(BASE_URL_LOCAL + `/api/intent`, JSON.stringify(data))
    .then(response => {
      console.log(response.id)
      return response.payload
    })
    
    .then(data => this.setDataSource(data.id))
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
      ...getColumnSearchProps('name'),
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
                //onDeleteData(record)
                onDeleteData1(record)
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

  const onViewData = (record) => {
      setIsPattern(true)
      setDataSource((pre) => {
          return pre.filter((data) => data.id !== record.id);
        })
      
  }


  const onEditData = (record) => {
    setIsEditing(true);
    setEditingData({ ...record });
    updateData(record, function(){
      fetchRecords(1);
    })
  };
  
  const onDeleteData1 = (record) => {
    setIsDeleteing(true);
    setDeleteingData({ ...record });
    deleteData(record, function(){
      fetchRecords(1);
    })
  };
  const resetDeleteing = () => {
    setIsDeleteing(false);
    setDeleteingData(null);
  };
  const resetEditing = () => {
    setIsEditing(false);
    setEditingData(null);
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
          pageSize: 10,
          total: 1000,
          onChange: (page) => {
            fetchRecords(page);
          },
        }}
        ></Table>
        <Modal
          title="Delete Data"
          open={isDeleteing}
          okText="Confirm"
          onCancel={() => {
            resetDeleteing();
          }}
          onOk={() => {
            setDataSource((pre) => {
                  return pre.filter((data) => data.id !== pre.id);
              });
            resetDeleteing();
          }
        }
        >
          
        </Modal>
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
    open={isPattern}
    okText="Confirm">
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


      </header>
    </div>
  );
}

export default Intent;