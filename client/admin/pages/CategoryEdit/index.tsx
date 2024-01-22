import React, { useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import Router, { useRouter } from 'next/router';
import BasicLayout from '@blog/client/admin/layouts';
import { useCreateCategoryMutation, useFetchCategoryMutation, useUpdateCategoryMutation } from '../Categories/service';
import { wrapper } from '@blog/client/redux/store';

export default function Index(props) {
    wrapper.useHydration(props);
    const router = useRouter();
    const [form] = Form.useForm();
    const [fetchCategory] = useFetchCategoryMutation();
    useEffect(() => {
        const { id } = router.query;
        if (id) {
            fetchCategory({ id: id.toString() })
                .unwrap()
                .then((res) => {
                    const category = res.data;
                    form.setFieldsValue(category);
                });
        }
    }, [fetchCategory, form, router.query]);
    const [createCategory] = useCreateCategoryMutation();
    const [updateCategory] = useUpdateCategoryMutation();
    const publish = (data) => {
        const { id } = router.query;
        const p = id ? updateCategory({ id: id.toString(), data }) : createCategory(data);
        p.then(() => {
            message.success('提交成功');
            Router.push('/admin/content/categories');
        });
    };
    return (
        <BasicLayout>
            <div className="main-content">
                <Form form={form} onFinish={publish} style={{ marginTop: '20px' }}>
                    <Form.Item
                        name="name"
                        labelCol={{ span: 3 }}
                        wrapperCol={{ span: 10 }}
                        label="Category Name:"
                        rules={[
                            {
                                required: true,
                                message: 'The length of the category name must be between 1 and 25 characters!',
                                min: 1,
                                max: 25,
                            },
                        ]}
                    >
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item labelCol={{ span: 3 }} wrapperCol={{ span: 10 }} label="Operation:">
                        <Button type="primary" htmlType="submit">
                            Publish
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </BasicLayout>
    );
}
