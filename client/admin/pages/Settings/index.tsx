import React, { useEffect } from 'react';
import BasicLayout from '@blog/client/admin/layouts';
import { message } from 'antd';
import isFQDN from 'validator/lib/isFQDN';
import EditableInput from '@blog/client/admin/components/EditableInput';
import EmailInput from './EmailInput';
import style from './style.module.scss';
import { useLazyFetchAdminConfigsQuery, useUpdateAdminConfigsMutation } from './service';
import { wrapper } from '@blog/client/redux/store';

export default function Settings(props) {
    wrapper.useHydration(props);
    const [fetchConfig, { data = {} }] = useLazyFetchAdminConfigsQuery();
    const [updateConfig, { isLoading }] = useUpdateAdminConfigsMutation();
    const onFinish = (values) => {
        updateConfig(values).then(() => {
            message.success('Update Success！');
        });
    };

    useEffect(() => {
        fetchConfig();
    }, [fetchConfig]);
    return (
        <BasicLayout>
            <div className={style.wrap}>
                <div className={style.tip}>Website Settings</div>
                <EditableInput
                    value={data.siteTitle}
                    label="Website Title"
                    name="siteTitle"
                    placeholder="Please enter the website title"
                    loading={isLoading}
                    onFinish={onFinish}
                ></EditableInput>
                <EditableInput
                    value={data.siteDomain}
                    label="Website Domain"
                    name="siteDomain"
                    placeholder="Please enter the website domain"
                    loading={isLoading}
                    onFinish={onFinish}
                    rules={[
                        {
                            validator: (rule, value) => {
                                if (isFQDN(value)) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('Please enter the correct domain name');
                            },
                        },
                    ]}
                ></EditableInput>
                <EditableInput
                    value={data.siteIcp}
                    label="Website ICP"
                    name="siteIcp"
                    placeholder="Please enter the website ICP"
                    loading={isLoading}
                    onFinish={onFinish}
                ></EditableInput>
                <EditableInput
                    type="svg"
                    extra="Please upload svg format"
                    value={data.siteLogo}
                    label="Website LOGO"
                    name="siteLogo"
                    loading={isLoading}
                    onFinish={onFinish}
                ></EditableInput>
                <div className={style.tip}>Website META Config</div>
                <EditableInput
                    type="textarea"
                    autoSize={{ minRows: 2, maxRows: 4 }}
                    value={data.siteMetaKeyWords}
                    label="META keywords"
                    name="siteMetaKeyWords"
                    placeholder="keywords"
                    loading={isLoading}
                    onFinish={onFinish}
                ></EditableInput>
                <EditableInput
                    type="textarea"
                    autoSize={{ minRows: 3, maxRows: 6 }}
                    value={data.siteMetaDescription}
                    label="META"
                    name="siteMetaDescription"
                    placeholder="description"
                    loading={isLoading}
                    onFinish={onFinish}
                ></EditableInput>
                <EmailInput data={data}></EmailInput>
            </div>
        </BasicLayout>
    );
}
