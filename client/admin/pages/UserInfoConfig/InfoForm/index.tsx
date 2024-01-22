import React, { useEffect } from 'react';
import { message } from 'antd';
import { Form, Input, Button, Divider } from 'antd';
import axios from '@blog/client/admin/axios';
import useRequestLoading from '@blog/client/admin/hooks/useRequestLoading';
import UploadButton from '@blog/client/admin/components/UploadButton';
import { useRouter } from 'next/router';

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

const getLoginInfo = () => {
    return axios.get('/user/login-info');
};

const updateUserInfo = (data) => {
    return axios.put('/user/update', data);
};

export default function InfoForm() {
    const router = useRouter();
    const { loading, injectRequestLoading } = useRequestLoading();
    const [form] = Form.useForm();
    useEffect(() => {
        getLoginInfo().then((res) => {
            form.setFieldsValue({ ...res.data, avatar: res.data.avatar });
        });
    }, [form]);
    const onFinish = (values) => {
        return injectRequestLoading(updateUserInfo(values)).then(() => {
            message.success('更新成功！');
            router.reload();
        });
    };
    return (
        <Form
            layout="vertical"
            form={form}
            name="UserForm"
            onFinish={onFinish}
            scrollToFirstError
            style={{ maxWidth: '540px', margin: '0 auto', width: '100%' }}
        >
            <Form.Item
                required={true}
                label="Avatar"
                name="avatar"
                rules={[{ required: true, message: 'Avatar should not be null' }]}
            >
                <UploadButton></UploadButton>
            </Form.Item>
            <Form.Item
                name="userName"
                label="username"
                extra="please use english or number."
                rules={[{ required: true, message: 'Please input your nickname!', whitespace: true }]}
            >
                <Input size="large" placeholder="username" />
            </Form.Item>
            <Form.Item
                name="email"
                label="email"
                extra="email is used for notification."
                rules={[
                    {
                        type: 'email',
                        message: 'The input is not valid E-mail!',
                    },
                    {
                        required: true,
                        message: 'Please input your E-mail!',
                    },
                ]}
            >
                <Input size="large" placeholder="please input your email" />
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
                <Button loading={loading} type="primary" htmlType="submit">
                    Save
                </Button>
            </Form.Item>
            <Divider />
        </Form>
    );
}
