import React, { useCallback, useEffect, useState } from 'react';
import { parseTime } from '@blog/client/libs/time';
import { Button, Popconfirm, message, Space } from 'antd';
import Router from 'next/router';
import { PlusOutlined, DeleteFilled, EditFilled } from '@ant-design/icons';
import BasicLayout from '@blog/client/admin/layouts';
import ActionCard from '@blog/client/admin/components/ActionCard';
import { useDeleteCategoriesMutation, useDeleteCategoryMutation, useFetchCategoriesMutation } from './service';
import CTable from '@blog/client/admin/components/CTable';
import { wrapper } from '@blog/client/redux/store';

export default function Index(props) {
    wrapper.useHydration(props);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [visible, setVisible] = useState(false);
    const [fetchCategories, { data = [], isLoading }] = useFetchCategoriesMutation();
    const fetchData = useCallback(() => {
        const query = {
            page: 1,
            limit: 100,
        };
        fetchCategories(query);
    }, [fetchCategories]);
    const [_deleteCategory, { isLoading: isDeleteCategoryLoading }] = useDeleteCategoryMutation();
    const deleteCategory = (id) => {
        _deleteCategory({ id })
            .unwrap()
            .then((res) => {
                message.success(`Successfully deleted category ${res.name}!`);
                fetchData();
            });
    };
    const [deleteCategories, { isLoading: isDeleteCategoriesLoading }] = useDeleteCategoriesMutation();
    const batchDeleteCategory = () => {
        deleteCategories({ categoryIds: selectedRowKeys })
            .unwrap()
            .then((res) => {
                if (res && res.deletedCount > 0) {
                    message.success(`Successfully deleted categories!`);
                    return fetchData();
                }
                message.error('Failed to delete categories, please try again.');
            });
    };
    const getTableColumns = () => {
        return [
            {
                title: 'Name',
                dataIndex: 'name',
            },
            {
                title: 'Creation Time',
                dataIndex: 'createdAt',
                render: (text, record) => parseTime(record.createdAt),
            },
            {
                title: 'Number of Articles',
                dataIndex: 'articleCount',
            },
            {
                title: 'Actions',
                key: 'operation',
                width: 180,
                render: (text, record) => (
                    <div>
                        <Button
                            type="primary"
                            size="small"
                            title="Edit"
                            icon={<EditFilled />}
                            onClick={() => Router.push('/admin/content/categories/edit/' + record._id)}
                        >
                            Edit
                        </Button>
                        ,
                        <Popconfirm title="Are you sure to delete?" onConfirm={() => deleteCategory(record._id)}>
                            <Button danger={true} size="small" title="Delete" icon={<DeleteFilled />}>
                                Delete
                            </Button>
                        </Popconfirm>
                    </div>
                ),
            },
        ];
    };
    useEffect(() => {
        fetchData();
    }, [fetchData]);
    const rowSelection = {
        selectedRowKeys,
        onChange: setSelectedRowKeys,
    };
    const CTitle = (
        <Space>
            <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => Router.push('/admin/content/categories/edit')}
            >
                Add Category
            </Button>
            <Popconfirm
                title="Are you sure to delete?"
                placement="right"
                open={visible}
                onConfirm={() => batchDeleteCategory()}
                onOpenChange={() => {
                    if (selectedRowKeys.length <= 0) {
                        message.info('Please select categories to delete');
                        return;
                    }
                    setVisible(!visible);
                }}
            >
                <Button danger={true} icon={<DeleteFilled />}>
                    Batch Delete
                </Button>
            </Popconfirm>
        </Space>
    );
    return (
        <BasicLayout>
            <ActionCard title={CTitle} bodyStyle={{ padding: 0 }}>
                <CTable
                    rowKey={(record: any) => record._id}
                    rowSelection={rowSelection}
                    columns={getTableColumns()}
                    loading={isLoading || isDeleteCategoryLoading || isDeleteCategoriesLoading}
                    dataSource={data}
                />
            </ActionCard>
        </BasicLayout>
    );
}
