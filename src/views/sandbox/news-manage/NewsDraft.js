import React, { useEffect, useState } from 'react'
import { Table, Button, Modal, notification } from 'antd'
import axios from 'axios'
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  UploadOutlined
} from '@ant-design/icons';

const { username } = JSON.parse(localStorage.getItem('token'))

export default function NewsDraft(props) {

  const [dataSource, setdataSource] = useState([])

  const { confirm } = Modal;
  useEffect(() => {
    axios(`news?author=${username}&auditState=0&_expand=category`).then(res => {
      const list = res.data
      setdataSource(list)
    })
  }, [])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '新闻标题',
      dataIndex: 'label',
      render: (label, item) => {
        return <a href={`#/news-manage/preview/${item.id}`} >{label}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author'
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (category) => {
        return category.title
      }
    },

    {
      title: '操作',
      key: 'Button',
      render: (item) => {
        return <div>
          <Button danger shape="circle" icon={<DeleteOutlined />} onClick={() => confirmMethod(item)} />
          <Button shape="circle" icon={<EditOutlined />} style={{ marginLeft: '10px' }}
            onClick={() => {
              props.history.push(`/news-manage/update/${item.id}`)
            }} />
          <Button type="primary" shape="circle" icon={<UploadOutlined />}
            onClick={() => handleCheck(item.id)} style={{ marginLeft: '10px' }}
          />
        </div>
      }
    },
  ]

  const handleCheck = (id) => {
    axios.patch(`/news/${id}`, {
      auditState: 1
    }).then(res => {
      props.history.push('/audit-manage/list')

      notification.info({
        message: `通知`,
        description:
          `请在审核列表中查看您撰写的新闻`,
        placement: 'bottomRight',
      });
    })
  }

  const confirmMethod = (item) => {
    confirm({
      title: '你确定要删除该新闻吗?',
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
    axios.delete(`/news/${item.id}`)

  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns}
        pagination={{
          pageSize: 5,
        }} rowKey={item => item.id} />
    </div>
  )
}
