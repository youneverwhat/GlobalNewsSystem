import React, { forwardRef, useEffect, useState } from 'react'
import { Form, Input, Select } from 'antd'

const { Option } = Select

const UserForm = forwardRef((props, ref) => {

    const [isDisable, setisDisable] = useState(false)
    const { roleId, region } = JSON.parse(localStorage.getItem('token'))
    const roleObj = {
        "1": "superadmin",
        "2": "admin",
        "3": "editor"
    }

    const checkRoleDisable = (item) => {
        if (props.isUpdate) {
            if (roleObj[roleId] === 'superadmin') {
                return false
            } else {
                return true
            }
        } else {
            if (roleObj[roleId] === 'superadmin') {
                return false
            } else {
                return roleObj[item.id] !== "editor"
            }
        }
    }
    const checkRegionDisable = (item) => {
        if (props.isUpdate) {
            if (roleObj[roleId] === 'superadmin') {
                return false
            } else {
                return true
            }
        } else {
            if (roleObj[roleId] === 'superadmin') {
                return false
            } else {
                return item.value !== region
            }
        }
    }
    useEffect(() => {
        setisDisable(props.isUpdateDisable)
    }, [props.isUpdateDisable])
    return (
        <Form
            layout="vertical"
            ref={ref}
        >
            <Form.Item
                name="username"
                label="用户名"
                rules={[
                    {
                        required: true,
                        message: 'Please input the username of collection!',
                    },
                ]}>
                <Input />
            </Form.Item>
            <Form.Item
                name="password"
                label="密码"
                rules={[
                    {
                        required: true,
                        message: 'Please input the password of collection!',
                    },
                ]}>
                <Input />
            </Form.Item>
            <Form.Item
                name="region"
                label="区域"
                rules={isDisable ? [] : [
                    {
                        required: true,
                        message: 'Please input the region of collection!',
                    },
                ]}>
                <Select disabled={isDisable}>
                    {
                        props.regionList.map(item => {
                            return <Option value={item.value} key={item.id}
                                disabled={checkRegionDisable(item)}
                            >{item.label}</Option>
                        })
                    }
                </Select>
            </Form.Item>
            <Form.Item
                name="roleId"
                label="角色"
                rules={[
                    {
                        required: true,
                        message: 'Please input the roleId of collection!',
                    },
                ]}>
                <Select onChange={(value) => {
                    if (value === 1) {
                        setisDisable(true)
                        ref.current.setFieldsValue({
                            region: ""
                        })
                    } else {
                        setisDisable(false)
                    }
                }}>
                    {
                        props.roleList.map(item => {
                            return <Option value={item.id} key={item.id}
                                disabled={checkRoleDisable(item)}
                            >{item.roleName}</Option>
                        })
                    }
                </Select>
            </Form.Item>
        </Form>
    )
})

export default UserForm