import React from 'react';
import Router from 'next/router';
import { Input, Button, Alert, message, Form, Image } from 'antd';
import { encrypt } from '@blog/client/admin/utils/crypto.util';
import { UserOutlined, LockOutlined, AliwangwangOutlined } from '@ant-design/icons';
import style from './style.module.scss';
import { useFetchConfigQuery } from '@blog/client/web/api';
import { useFetchFirstMessageQuery, useLoginMutation } from './service';
import defaultConfig from '@blog/client/configs/admin.default.config';
import { wrapper } from '@blog/client/redux/store';

export default function UserLogin(props) {
    wrapper.useHydration(props);
    const { data = { message: '' } } = useFetchFirstMessageQuery();
    const { data: appConfig } = useFetchConfigQuery();
    const [login, { isLoading }] = useLoginMutation();
    const handleLogin = async (_data) => {
        const str = encrypt(JSON.stringify(_data));
        await login({ key: str })
            .unwrap()
            .then((res) => {
                localStorage.setItem(defaultConfig.tokenKey, res.token);
                message.success('Login Success！');
                Router.push('/admin/content/articles');
            });
    };
    return (
        <div className={style.signIn}>
            <div className={style.signInMain}>
                <div className="header">
                    <Image width={60} preview={false} className="brand" src={appConfig.siteLogo} alt="" />
                    <div className="header-title">
                        <h2>{appConfig.siteTitle}</h2>
                        <p>LIGHT NODE BLOG SYSTEM</p>
                    </div>
                </div>
                <div className={style.signInPanel}>
                    <div className={style.signInHeader}>
                        <h3 className={style.signInTitle}>Admin Login</h3>
                    </div>
                    {data?.message && (
                        <Alert message={data.message} type="warning" style={{ margin: '0 20px 20px 20px' }} />
                    )}
                    <Form onFinish={handleLogin} className="login-form">
                        {data?.message && (
                            <Form.Item
                                name="userName"
                                label="Username："
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 16 }}
                                rules={[{ required: true, message: 'Please input your username!' }]}
                            >
                                <Input prefix={<AliwangwangOutlined />} placeholder="username" />
                            </Form.Item>
                        )}
                        <Form.Item
                            name="account"
                            label="Account:"
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 16 }}
                            rules={[{ required: true, message: 'Please input your account!' }]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="account" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            label="Password："
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 16 }}
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input prefix={<LockOutlined />} type="password" placeholder="Please input" />
                        </Form.Item>
                        <Form.Item label="" labelCol={{ span: 6 }} wrapperCol={{ span: 16 }}>
                            <Button loading={isLoading} type="primary" htmlType="submit" className="login-form-button">
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                <div className="nodeblog">
                    Powered by
                    <a
                        href={appConfig.siteDomain}
                        title="light node blog system"
                        rel="noopener noreferrer"
                        target="_blank"
                    >
                        NODEBLOG
                    </a>
                </div>
            </div>
        </div>
    );
}
