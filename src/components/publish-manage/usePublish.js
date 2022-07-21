import { useEffect, useState } from 'react'
import { notification } from 'antd'
import axios from 'axios'

function usePublish(type) {
    const [dataSource, setdataSource] = useState([])
    const { username } = JSON.parse(localStorage.getItem('token'))
    useEffect(() => {
        axios(`/news?author=${username}&publishState=${type}&_expand=category`
        ).then(res => {
            setdataSource(res.data)
        })
    }, [username, type])

    const handlePublish = (id) => {
        setdataSource(dataSource.filter(item => item.id !== id))

        axios.patch(`/news/${id}`, {
            "publishState": 2,
            "publishTime": Date.now(),
        }).then(res => {
            notification.info({
                message: `通知`,
                description:
                    `您可以在【发布管理/已发布】查看您撰写的新闻`,
                placement: 'bottomRight',
            });
        })
    }
    const handleSunset = (id) => {
        setdataSource(dataSource.filter(item => item.id !== id))
        axios.patch(`/news/${id}`, {
            "publishState": 3,
        }).then(res => {
            notification.info({
                message: `通知`,
                description:
                    `您可以在【发布管理/已下线】查看您撰写的新闻`,
                placement: 'bottomRight',
            });
        })

    }
    const handleDelete = (id) => {
        setdataSource(dataSource.filter(item => item.id !== id))
        axios.delete(`/news/${id}`).then(res => {
            notification.info({
                message: `通知`,
                description:
                    `您删除了您已下线的新闻`,
                placement: 'bottomRight',
            });
        })
    }

    return {
        dataSource,
        handlePublish,
        handleSunset,
        handleDelete
    }
}

export default usePublish