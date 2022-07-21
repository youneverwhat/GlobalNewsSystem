import React, { useEffect, useState, useRef } from 'react'
import { Table, Button, Modal, Switch } from 'antd'
import axios from 'axios'
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import UserForm from '../../../components/user-mange/UserForm';



const { confirm } = Modal;


export default function UserList() {

    const [dataSource, setdataSource] = useState([])
    const [isAddvisible, setisAddvisible] = useState(false)
    const [isUpdatevisible, setisUpdatevisible] = useState(false)
    const [roleList, setroleList] = useState([])
    const [regionList, setregionList] = useState([])
    const addForm = useRef(null)
    const UpdateForm = useRef(null)

    const [isUpdateDisable, setisUpdateDisable] = useState(false)
    const [current, setcurrent] = useState(null)
    const {roleId,region,username} = JSON.parse(localStorage.getItem('token'))

   

    useEffect(() => {  //获取用户数据
        const roleObj = {
            "1":"superadmin",
            "2":"admin",
            "3":"editor"
        }
        axios('/users?_expand=role').then(res => {
            const list = res.data
            setdataSource(roleObj[roleId] === 'superadmin'? list:[
                ...list.filter(item=>item.username === username ),
                ...list.filter(item=>item.region === region&&roleObj[item.roleId]==='editor')
            ])
        })
    }, [roleId,region,username])
    useEffect(() => { //获取区域数据
        axios('/regions').then(res => {
            const list = res.data
            setregionList(list)
        })
    }, [])
    useEffect(() => { //获取角色数据
        axios('/roles').then(res => {
            const list = res.data
            setroleList(list)
        })
    }, [])


    const columns = [
        {
            title: '区域',
            dataIndex: 'region',
            filters:[
                ...regionList.map(item=>({
                    text:item.label,
                    value:item.value
                })),
                {
                    text:'全球',
                    value:'全球'
                }
            ],

            onFilter:(value,item)=>{
                if(value==='全球'){
                    return item.region===''
                }
                return item.region===value
            },
            render: (region) => { return <b>{region === "" ? '全球' : region}</b> }
        },
        {
            title: '角色名称',
            dataIndex: 'role',
            render: (role) => {
                return role?.roleName
            }
        },
        {
            title: '用户名',
            dataIndex: 'username',
        },
        {
            title: '用户状态',
            dataIndex: 'roleState',
            render: (roleState, item) => {
                return <Switch checked={roleState} disabled={item.default} onChange={() => handleChange(item)} ></Switch>
            }
        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined />}
                        disabled={item.default} onClick={() => confirmMethod(item)} />
                    <Button type="primary" shape="circle" icon={<EditOutlined />} style={{ marginLeft: '10px' }}
                        disabled={item.default}
                        onClick={() => handleUpdate(item)}
                    />
                </div>
            }
        },
    ]

    const handleUpdate = async (item) => {

        await setisUpdatevisible(true)
        if (item.roleId === 1) {
            //禁用
            setisUpdateDisable(true)
        } else {
            setisUpdateDisable(false)
        }
        UpdateForm.current?.setFieldsValue(item)

        setcurrent(item)

    }

    const handleChange = (item) => {
        item.roleState = !item.roleState
        setdataSource([...dataSource])
        axios.patch(`/users/${item.id}`, {
            roleState: item.roleState
        })
    }

    const confirmMethod = (item) => {
        confirm({
            title: '你确定要解除该权限吗?',
            icon: <ExclamationCircleOutlined />,
            // content: 'Some descriptions',
            onOk() {
                deleteMethod(item)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    const deleteMethod = (item) => {
        //当前页面同步状态+后端同步
        setdataSource(dataSource.filter(data => data.id !== item.id))
        axios.delete(`/users/${item.id}`)
    }
    const AddForm = () => {
        addForm.current.validateFields().then(value => {
            setisAddvisible(false)
            addForm.current.resetFields()
            axios.post(`/users`, {
                ...value,
                "roleState": true,
                "default": false
            }).then(res => {
                setdataSource([...dataSource, {
                    ...res.data,
                    role: roleList.filter(item => item.id === value.roleId)[0]
                }])
            })
        }).catch(error => {
            console.log(error);
        })
    }
    const UpdateFormOk = () => {
        UpdateForm.current.validateFields().then(value => {
            setisUpdatevisible(false)
            setdataSource(dataSource.map(item => {
                if (item.id === current.id) {
                    return {
                        ...item,
                        ...value,
                        role: roleList.filter(data => data.id === value.roleId)[0]
                    }
                }
                return item
            }))
            setisUpdateDisable(!isUpdateDisable)

            axios.patch(`/users/${current.id}`, value)
        })
    }
    return (
        <div>
            <Button type='primary' onClick={() => {
                setisAddvisible(true)
            }}>添加用户</Button>
            <Table dataSource={dataSource} columns={columns}
                pagination={{
                    pageSize: 5
                }}
                rowKey={item => item.id}
            />

            <Modal
                visible={isAddvisible}
                title="添加角色用户"
                okText="Create"
                cancelText="Cancel"
                onCancel={() => {
                    setisAddvisible(false)
                }}
                onOk={() => {
                    AddForm()
                }}>
                <UserForm regionList={regionList} roleList={roleList} ref={addForm} />
            </Modal>

            <Modal
                visible={isUpdatevisible}
                title="更新角色用户"
                okText="Update"
                cancelText="Cancel"
                onCancel={() => {
                    setisUpdatevisible(false)
                    setisUpdateDisable(!isUpdateDisable)
                }}
                onOk={() => {
                    UpdateFormOk()
                }}>
                <UserForm isUpdate={true} regionList={regionList} roleList={roleList} ref={UpdateForm} isUpdateDisable={isUpdateDisable} />
            </Modal>
        </div>
    )
}
