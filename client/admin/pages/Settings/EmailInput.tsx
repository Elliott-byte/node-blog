import React, { useEffect, useState } from 'react';
import { Input, Form, Button, Switch, message } from 'antd';
import { EditOutlined, SendOutlined, CloseOutlined, CheckOutlined, SoundOutlined } from '@ant-design/icons';
import style from './style.module.scss';
import { useTestEmailMutation, useUpdateEmailConfigMutation } from './service';

interface Props {
    data?: object;
}

export default function EmailInput(props: Props) {
    const [testEmail, { isLoading: testEmailLoading }] = useTestEmailMutation();
    const [updateEmailConfig, { isLoading: updateLoading }] = useUpdateEmailConfigMutation();
    const { data } = props;
    const [disabled, setDisabled] = useState(true);
    const [form] = Form.useForm();
    const onFinish = (values) => {
        updateEmailConfig(values).then(() => {
            message.success('Update Success！');
        });
    };
    useEffect(() => {
        form.setFieldsValue(data);
    }, [data, form]);
    return (
        <Form form={form} className="form" layout="vertical" onFinish={onFinish} wrapperCol={{ span: 16 }}>
            <div className={style.tip}>
                Email Settings
                {disabled && (
                    <Button
                        type="link"
                        danger={true}
                        onClick={() => {
                            setDisabled(!disabled);
                        }}
                    >
                        <EditOutlined></EditOutlined>Edit
                    </Button>
                )}
            </div>
            <Form.Item label="Email SMTP Address" name="smtpHost">
                <Input size="large" placeholder="Please enter the Email SMTP address" disabled={disabled} />
            </Form.Item>
            <Form.Item label="Email Address" name="smtpAuthUser">
                <Input size="large" placeholder="Please enter your email address" disabled={disabled} />
            </Form.Item>
            <Form.Item label="Email Authorization Password" name="smtpAuthpass">
                <Input.Password
                    size="large"
                    placeholder="Please enter the email authorization password"
                    disabled={disabled}
                />
            </Form.Item>
            <Form.Item
                name="isEnableSmtp"
                valuePropName="checked"
                label="Enable Email Notification Service"
                extra="If checked, the system will send you notification emails when there are new comments"
            >
                <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} disabled={disabled} />
            </Form.Item>
            {!disabled && (
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={updateLoading} style={{ marginRight: '10px' }}>
                        <SendOutlined></SendOutlined>Save Email Configuration
                    </Button>
                    <Button
                        loading={testEmailLoading}
                        onClick={() => {
                            testEmail()
                                .unwrap()
                                .then((res) => {
                                    if (res === true) {
                                        return message.success('Email configuration is correct!');
                                    }
                                    message.error('Email configuration error!');
                                });
                        }}
                    >
                        <SoundOutlined />
                        Test Send Email
                    </Button>
                </Form.Item>
            )}
        </Form>
    );
}
