import React from 'react';
import { Form, Input, Button, message, Popconfirm } from 'antd';
import axios from '@blog/client/admin/axios';
import { encrypt } from '@blog/client/admin/utils/crypto.util';

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

const resetPassword = (data) => {
    return axios.put('/user/reset-password', data);
};

export default function PasswordForm() {
    const [form] = Form.useForm();
    return (
        <Form
            form={form}
            layout="vertical"
            name="passwrodForm"
            scrollToFirstError
            style={{ maxWidth: '540px', margin: '0 auto', width: '100%' }}
            onFinish={(data) => {
                const password = data.password;
                const str = encrypt(JSON.stringify({ password }));
                resetPassword({ key: str }).then(() => {
                    message.success('password reset success');
                });
            }}
        >
            <Form.Item
                name="password"
                label="new password"
                extra="password should be at least 6 characters."
                rules={[
                    {
                        required: true,
                        message: 'Please input your password',
                    },
                ]}
                hasFeedback
            >
                <Input.Password size="large" placeholder="password" />
            </Form.Item>
            <Form.Item
                name="confirm"
                label="confirm password"
                extra="please confirm your password."
                dependencies={['password']}
                hasFeedback
                rules={[
                    {
                        required: true,
                        message: 'please confirm your password',
                    },
                    ({ getFieldValue }) => ({
                        validator(rule, value) {
                            if (!value || getFieldValue('password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject('passwords do not match');
                        },
                    }),
                ]}
            >
                <Input.Password size="large" placeholder="please confirm your password" />
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
                <Popconfirm title="Are you sure you want to reset your password?" onConfirm={() => form.submit()}>
                    <Button type="primary" danger={true}>
                        Reset Password
                    </Button>
                </Popconfirm>
            </Form.Item>
        </Form>
    );
}
