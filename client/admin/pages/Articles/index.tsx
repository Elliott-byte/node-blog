import React, { useState, useEffect, useCallback } from 'react';
import Router from 'next/router';
import { parseTime } from '@blog/client/libs/time';
import { Button, Popconfirm, message, Input, Row, Tag, Typography, Image, Space } from 'antd';
import { PlusOutlined, DeleteFilled, EditFilled, SearchOutlined, HighlightOutlined } from '@ant-design/icons';
import BasicLayout from '@blog/client/admin/layouts';
import ActionCard from '@blog/client/admin/components/ActionCard';
import { useDeleteArticleMutation, useDeleteArticlesMutation, useFetchArticlesMutation } from './service';
import CTable from '@blog/client/admin/components/CTable';
import { wrapper } from '@blog/client/redux/store';

export default function Index(props) {
    wrapper.useHydration(props);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [visible, setVisible] = useState(false);
    const [searchKey, setSearchKey] = useState('');
    const [state, setState] = useState({
        current: 1,
        pageSize: 10,
    });
    const [fetchArticles, { data = { items: [], count: 0 }, isLoading }] = useFetchArticlesMutation();
    const fetchData = useCallback(
        (searchKey = '') => {
            const query = {
                page: state.current || 1,
                limit: state.pageSize || 10,
                ...(searchKey ? { title: searchKey } : {}),
            };
            fetchArticles(query)
                .unwrap()
                .then((res) => {
                    if (res.items.length === 0 && state.current > 1) {
                        setState((s) => {
                            const temp = { ...s };
                            Object.assign(temp, {
                                current: temp.current - 1,
                            });
                            return temp;
                        });
                    }
                });
        },
        [state, fetchArticles]
    );
    const [_deleteArticle, { isLoading: isDeleteArticleLoading }] = useDeleteArticleMutation();
    const deleteArticle = (id) => {
        _deleteArticle({ id }).then(() => {
            message.success('delete article successfully');
            fetchData();
        });
    };
    const [deleteArticles, { isLoading: isDeleteArticlesLoading }] = useDeleteArticlesMutation();
    const batchDeleteArticle = () => {
        deleteArticles({
            articleIds: selectedRowKeys,
        })
            .unwrap()
            .then((res) => {
                if (res && res.deletedCount > 0) {
                    message.success('batch delete articles successfully!');
                    return fetchData();
                }
                message.error('delete articles failed');
            });
    };
    const getTableColums = () => {
        return [
            {
                title: 'Article Title',
                dataIndex: 'title',
                render: (text, record) => (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ marginRight: '15px' }}>
                            <a href={'/blog/articles/' + record._id} className="thumbnail">
                                <Image
                                    preview={false}
                                    alt=""
                                    src={record.screenshot}
                                    width="100px"
                                    height="60px"
                                    fallback="data:image/png;base64,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"
                                />
                            </a>
                        </div>
                        <div>
                            <Typography.Paragraph style={{ fontSize: '14px', fontWeight: 'normal' }}>
                                {text}
                            </Typography.Paragraph>
                            <div>
                                <Button
                                    size="small"
                                    title="Edit"
                                    type="link"
                                    icon={<EditFilled />}
                                    onClick={() => Router.push('/admin/content/articles/edit/' + record._id)}
                                >
                                    Edit
                                </Button>
                                <Popconfirm
                                    title="Do you want to delete it ？"
                                    onConfirm={() => deleteArticle(record._id)}
                                >
                                    <Button danger type="link" size="small" title="Delete" icon={<DeleteFilled />}>
                                        Delete
                                    </Button>
                                </Popconfirm>
                            </div>
                        </div>
                    </div>
                ),
            },
            {
                title: 'Category',
                dataIndex: 'category',
                width: 100,
                render: (text, record) => (record.category ? record.category.name : 'No Category'),
            },
            {
                title: 'views',
                dataIndex: 'viewsCount',
                width: 80,
            },
            {
                title: 'comments',
                dataIndex: 'commentCount',
                width: 80,
            },
            {
                title: 'status',
                dataIndex: 'isDraft',
                render: (text, record) =>
                    record.isDraft ? <Tag color="default">Draft</Tag> : <Tag color="green">Published</Tag>,
            },
            {
                title: 'Creation Time',
                dataIndex: 'createdAt',
                width: 160,
                render: (text, record) => parseTime(record.createdAt),
            },
        ];
    };
    const handleTableChange = (pagination) => {
        setState((data) => ({
            ...data,
            current: pagination.current,
        }));
    };
    const onSelectChange = (selectedRowKeys) => {
        setSelectedRowKeys(selectedRowKeys);
    };
    useEffect(() => {
        fetchData();
    }, [fetchData]);
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange.bind(this),
    };
    const CTitle = (
        <Row justify="space-between">
            <Space>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => Router.push('/admin/content/articles/edit')}
                >
                    Add Article
                </Button>
                <Popconfirm
                    title="Do you want to delete it ？"
                    placement="right"
                    open={visible}
                    onConfirm={() => batchDeleteArticle()}
                    onOpenChange={() => {
                        if (selectedRowKeys.length <= 0) {
                            message.info('Please select articles to delete');
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
            <Space>
                <Input
                    type="text"
                    name="searchTitle"
                    placeholder="Please enter article title"
                    value={searchKey}
                    onChange={(e) => {
                        const value = e.currentTarget.value;
                        setSearchKey(value);
                    }}
                />
                <Button
                    type="primary"
                    icon={<SearchOutlined />}
                    onClick={() => {
                        fetchData(searchKey);
                    }}
                >
                    Search
                </Button>
                <Button
                    type="primary"
                    icon={<HighlightOutlined />}
                    onClick={() => {
                        setState((value) => ({
                            ...value,
                            searchKey: '',
                            isResetFetch: true,
                        }));
                    }}
                >
                    Reset
                </Button>
            </Space>
        </Row>
    );
    return (
        <BasicLayout>
            <ActionCard title={CTitle} bodyStyle={{ padding: 0 }}>
                <CTable
                    rowKey={(record) => record._id}
                    rowSelection={rowSelection}
                    columns={getTableColums()}
                    dataSource={data.items}
                    pagination={{
                        current: state.current,
                        pageSize: state.pageSize,
                        total: data.totalCount,
                    }}
                    loading={isLoading || isDeleteArticlesLoading || isDeleteArticleLoading}
                    onChange={(pagination) => handleTableChange(pagination)}
                />
            </ActionCard>
        </BasicLayout>
    );
}
