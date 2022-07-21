import React, { useEffect, useState } from 'react'
import { Table, Button, notification} from 'antd'
import axios from 'axios'
import {
    CheckOutlined,
    CloseOutlined
} from '@ant-design/icons';
export default function Audit() {

    const [dataSource, setdataSource] = useState([])
    const { roleId, region, username } = JSON.parse(localStorage.getItem('token'))

    useEffect(() => {
        const roleObj = {
            "1": "superadmin",
            "2": "admin",
            "3": "editor"
        }
        axios.get(`/news?auditState=1&_expand=category`).then(res => {
            const list = res.data
            setdataSource(roleObj[roleId] === 'superadmin' ? list : [
                ...list.filter(item => item.author === username),
                ...list.filter(item => item.region === region && roleObj[item.roleId] === 'editor')
            ])
        })
    }, [roleId, region, username])

    const columns = [
        {
            title: '新闻标题',
            dataIndex: 'label',
            key: 'label',
            render: (label, item) => {
                return <a href={`#/news-manage/preview/${item.id}`}>{label}</a>
            }
        },
        {
            title: '作者',
            dataIndex: 'author',
        },
        {
            title: '新闻分类',
            dataIndex: 'category',
            render: (category) => {
                return <div>{category.title}</div>
            }
        },

        {
            title: '操作',
            render: (item) => {
                return <div>
                    <Button type='primary' icon={<CheckOutlined />} shape="circle"
                        onClick={() => handleAudit(item, 2, 1)} />
                    <Button danger shape="circle" icon={<CloseOutlined />} style={{ margin: '0 10px' }}
                        onClick={() => handleAudit(item, 3, 0)} />
                </div>
            }
        },
    ]

    const handleAudit = (item, auditState, publishState) => {
        setdataSource(dataSource.filter(data => data.id !== item.id))
        axios.patch(`/news/${item.id}`, {
            auditState,
            publishState
        }).then(res => {
            notification.info({
                message: `通知`,
                description:
                    `您可以在【审核管理/审核列表】查看您的新闻的审核状态`,
                placement: 'bottomRight',
            });
        })
    }

    return (
        <div>
            <Table dataSource={dataSource} columns={columns}
                pagination={{
                    pageSize: 5
                }}
                rowKey={item => item.id}
            />
        </div>
    )
}
