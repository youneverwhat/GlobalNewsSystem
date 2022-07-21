import React, { useState, useEffect } from 'react'
import { Table, Button, Modal, Tree } from 'antd'
import axios from 'axios'
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';

export default function RoleList() {
    const [dataSource, setdataSource] = useState([])
    const [rightList, setRightList] = useState([])
    const [currentRights, setcurrentRights] = useState([]) //弹出权限列表
    const [currentId, setcurrentId] = useState(0) //弹出权限列表
    const [isModalVisible, setisModalVisible] = useState(false)
    const { confirm } = Modal
    useEffect(() => {
        axios.get('/roles').then(res => {
            setdataSource(res.data)
        })

    }, [])
    useEffect(() => {
        axios.get('/rights?_embed=children').then(res => {

            setRightList(res.data)
        })

    }, [])
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (id) => {
                return <b>{id}</b>
            }
        },
        {
            title: '角色名称',
            dataIndex: 'roleName',

        },
        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />
                    <Button type="primary" shape="circle" icon={<EditOutlined />} style={{ marginLeft: '10px' }} onClick={() => {
                        setisModalVisible(true)
                        setcurrentRights(item.rights)
                        setcurrentId(item.id)
                    }} />
                </div>
            }
        },
    ]

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
        axios.delete(`/roles/${item.id}`)
    }

    const handleOk = () => {
        setisModalVisible(false)
        setdataSource(dataSource.map(item => {
            if (item.id === currentId) {
                return {
                    ...item,
                    rights: currentRights
                }
            }
            return item
        }))
        axios.patch(`/roles/${currentId}`, {
            rights: currentRights
        })
    }
    const handleCancel = () => {
        setisModalVisible(false)
    }
    const onCheck = (checkKeys) => {
        setcurrentRights(checkKeys.checked)
    }
    return (
        <div>
            <Table dataSource={dataSource} columns={columns}
                rowKey={(item) => item.id} ></Table>


            <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
                <Tree
                    checkedKeys={currentRights}
                    checkable
                    treeData={rightList}
                    onCheck={onCheck}
                    checkStrictly={true}
                />
            </Modal>
        </div>
    )
}
