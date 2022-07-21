import {
    UserOutlined,
    AppstoreOutlined,
    UnorderedListOutlined,
    ApartmentOutlined,
    CameraOutlined,
    HomeOutlined
} from '@ant-design/icons';
import React, { useEffect, useState } from 'react'
import { Layout, Menu } from 'antd'
import './index.css'
import { withRouter } from 'react-router-dom'
import axios from 'axios';
import { connect } from 'react-redux';

const { Sider } = Layout;
const {role:{rights}} = JSON.parse(localStorage.getItem('token'))

const iconList = {
    '/home': <HomeOutlined />,
    '/user-manage': <UnorderedListOutlined />,
    '/right-manage': <UserOutlined />,
    '/audit-manage': <ApartmentOutlined />,
    '/publish-manage': <AppstoreOutlined />,
    '/news-manage': <CameraOutlined />,
}

const proRightId = (data,rights) => {
    const Data = data.filter((item)=>{
        return item.pagepermisson === 1 && rights.includes(item.key)  // pagepermisson为0的不显示，跟权限列表中的配置按钮相互配合
    })
    const newData = Data.map((item) => { //对jsonserver 返回的数据进行处理
        item.icon = iconList[item.key]
        if (!item.children.length) //判断以及标签下是否有子标签
        {
            delete item.children //去除空白的children键值对
            return item
        }
        const newChild = item.children.filter((citem) => {
            if (citem.pagepermisson) {
                citem.rightid = citem.rightId
                delete citem.rightId //删除rightId 属性
                return citem && rights.includes(citem.key)  
            }
            return null
        })
        item.children = newChild
        return item 
    })
    return newData 
}

function SideMenu(props) {
    const [menu, setMenu] = useState([])
    useEffect(() => {
        axios.get('/rights?_embed=children').then(res => {
            const newData = proRightId(res.data,rights)
            setMenu(newData)
        })
    },[])
    // const [collapsed, setCollapsed] = useState(false);
    const selectKey = [props.location.pathname]
    const openKey = ["/"+props.location.pathname.split('/')[1]]

   
    return (
        <Sider trigger={null} collapsible collapsed={props.isCollapsed}>
            <div style={{display:'flex',height:'100%',"flexDirection":"column"}}>
                <div className="logo" >全球新闻发布管理系统</div>
                <Menu
                    style={{flex:1,"overflow":'auto'}}
                    theme="dark"
                    mode="inline"
                    selectedKeys={selectKey}
                    defaultOpenKeys={openKey}
                    items={menu}
                    onClick={(item) => {
                        props.history.push(item.key)
                    }}
                />
            </div>
        </Sider>
    )
}

const mapStateToProps = ({CollApsedReducer:{isCollapsed}}) => {
    return {
        isCollapsed
    }
}

export default connect(mapStateToProps)(withRouter(SideMenu)) //高阶组件给 SideMenu 的props 提供各种属性、方法