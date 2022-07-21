import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Layout, Dropdown, Menu, Avatar } from 'antd';
import React from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

function TopHeader(props) {

    const { Header } = Layout;

    const { role: { roleName }, username } = JSON.parse(localStorage.getItem('token'))

    const menu = (
        <Menu
            items={[
                {
                    key: '1',
                    label: (
                        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                            {roleName}
                        </a>
                    ),
                },
                {
                    key: '4',
                    danger: true,
                    label: '退出',
                    onClick: () => {
                        localStorage.removeItem("token")
                        props.history.replace('/login')
                    }
                },
            ]}
        />
    );

    return (

        <Header
            className="site-layout-background"
            style={{
                padding: 16,
                position: 'relative'
            }}
        >
            {React.createElement(props.isCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: () => props.changeCollapsed()
                    
            })}

            <div style={{ float: 'right', marginTop: '-15px' }}>
                <span>Welcome <span style={{ color: '#1890ff' }}>{username}</span></span>
                <Dropdown overlay={menu}>
                    <span>
                        <Avatar style={{ backgroundColor: '#87d068', margin: '-10px 0 0 10px' }} icon={<UserOutlined />} />
                    </span>

                </Dropdown>
            </div>
        </Header>


    )
}

const mapStateToProps = ({CollApsedReducer:{isCollapsed}}) => {
    return{
        isCollapsed
    }
}
const mapDispatchToProps = {
    changeCollapsed(){
        return{
            type:'change_collapsed'
        }
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(withRouter(TopHeader)) 