import React from 'react'
import { Form, Button, Input, message } from 'antd'
import {
    UserOutlined,
    LockOutlined
} from '@ant-design/icons';
import style from './Login.module.css'
import Particles from 'react-tsparticles'
import { loadFull } from "tsparticles";
import options from './options';
import axios from 'axios';

export default function Login(props) {

    const particlesInit = async (main) => {
        await loadFull(main);
    };

    //粒子被正确加载到画布中时，这个函数被调用
    const particlesLoaded = (container) => {
        // console.log("123", container);
    };

    const onFinish = (values) => {
        axios.get(
            `/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`
        ).then(res => {

            if (res.data.length === 0) {
                message.error('用户名或密码不匹配')
            }else{
                localStorage.setItem('token',JSON.stringify(res.data[0]))
                props.history.push('/home')
            }
        })
    }


    return (
        <div style={{ background: 'rgb(35,39,69)', height: "100%" }}>
            <Particles
                id="tsparticles"
                init={particlesInit}
                loaded={particlesLoaded}
                options={options}
            />
            <div className={style.formContainer}>
                <div className={style.logintitle}>News management system</div>
                <Form
                    name="normal_login"
                    className="login-form"
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Username!',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Password!',
                            },
                        ]}
                    >
                        <Input
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item className={style.LoginBtn}>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            Log In
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
