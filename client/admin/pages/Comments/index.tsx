import React, { useCallback, useEffect, useState } from 'react';
import { parseTime, timeAgo } from '@blog/client/libs/time';
import { Button, Popconfirm, Space, message } from 'antd';
import { handleEmoji } from '@blog/client/common/helper.util';
import Router from 'next/router';
import { DeleteFilled, EditFilled, SendOutlined, CommentOutlined, BranchesOutlined } from '@ant-design/icons';
import BasicLayout from '@blog/client/admin/layouts';
import style from './style.module.scss';
import ActionCard from '@blog/client/admin/components/ActionCard';
import { useDeleteCommentMutation, useDeleteCommentsMutation, useFetchCommentsMutation } from './service';
import CTable from '@blog/client/admin/components/CTable';
import { wrapper } from '@blog/client/redux/store';
import Avatar from 'boring-avatars';
import { xss } from '@blog/client/libs/marked';

export default function Comments(props) {
    wrapper.useHydration(props);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [visible, setVisible] = useState(false);
    const [fetchComments, { data = { items: [], totalCount: 0 }, isLoading }] = useFetchCommentsMutation();
    const [state, setState] = useState({
        current: 1,
        pageSize: 10,
    });
    const fetchData = useCallback(() => {
        const query = {
            page: state.current || 1,
            limit: state.pageSize || 10,
        };
        fetchComments(query)
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
    }, [fetchComments, state]);
    const [_deleteComment] = useDeleteCommentMutation();
    const deleteComment = (id) => {
        _deleteComment({ id }).then(() => {
            message.success('Comment deleted successfully');
            fetchData();
        });
    };
    const [_deleteComments] = useDeleteCommentsMutation();
    const batchDeleteComment = () => {
        _deleteComments({ commentIds: selectedRowKeys })
            .unwrap()
            .then((res) => {
                if (res && res.deletedCount > 0) {
                    message.success('Comments deleted successfully!');
                    return fetchData();
                }
                message.error('Failed to delete comments, please try again.');
            });
    };
    const handleTableChange = (pagination) => {
        setState((data) => ({
            ...data,
            current: pagination.current,
        }));
        fetchData();
    };
    const onSelectChange = (selectedRowKeys) => {
        setSelectedRowKeys(selectedRowKeys);
    };
    useEffect(() => {
        fetchData();
    }, [fetchData]);
    const getTableColumns = () => {
        return [
            {
                title: 'Nickname',
                dataIndex: 'nickName',
                width: 160,
            },
            {
                title: 'Article Title',
                dataIndex: 'article',
                render: (text, record) => (record.article && record.article.title) || '--',
            },
            {
                title: 'Creation Time',
                dataIndex: 'createdAt',
                width: 180,
                render: (text, record) => parseTime(record.createdAt),
            },
            {
                title: 'Operation',
                key: 'operation',
                width: 180,
                render: (text, record) => (
                    <Space>
                        <Button
                            type="primary"
                            size="small"
                            title="Edit"
                            icon={<EditFilled />}
                            onClick={() => Router.push('/admin/content/comments/reply/' + record._id)}
                        >
                            Reply
                        </Button>
                        <Popconfirm title="Are you sure to delete?" onConfirm={() => deleteComment(record._id)}>
                            <Button danger={true} size="small" title="Delete" icon={<DeleteFilled />}>
                                Delete
                            </Button>
                        </Popconfirm>
                    </Space>
                ),
            },
        ];
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange.bind(this),
    };
    const expandedRowKeys = data.items.map((item) => item._id);
    const CTitle = (
        <Popconfirm
            title="Are you sure to delete?"
            placement="right"
            open={visible}
            onOpenChange={() => {
                if (selectedRowKeys.length <= 0) {
                    message.info('Please select comments to delete');
                    return;
                }
                setVisible(!visible);
            }}
            onConfirm={() => batchDeleteComment()}
        >
            <Button danger={true} icon={<DeleteFilled />}>
                Batch Delete
            </Button>
        </Popconfirm>
    );
    return (
        <BasicLayout>
            <ActionCard title={CTitle} bodyStyle={{ padding: 0 }}>
                <CTable
                    rowKey={(record) => record._id}
                    rowSelection={rowSelection}
                    columns={getTableColumns()}
                    loading={isLoading}
                    dataSource={data.items}
                    onChange={(pagination) => handleTableChange(pagination)}
                    pagination={{
                        current: state.current,
                        pageSize: state.pageSize,
                        total: data.totalCount,
                    }}
                    expandedRowRender={(record) => {
                        return (
                            <React.Fragment>
                                {record.reply && (
                                    <div>
                                        <div className={style.tip}>
                                            <BranchesOutlined />
                                            Reference:
                                        </div>
                                        <div className={style.replyListItem}>
                                            <div className={style.userAvatar}>
                                                <Avatar size={32} name={record.reply.nickName} variant="beam" />
                                            </div>
                                            <div className={style.replyContent}>
                                                <div className={style.replyInfo}>
                                                    <div className={style.baseInfo}>
                                                        <div className="reply-author">{record.reply.nickName}</div>
                                                        <a className="reply-time">
                                                            Commented {timeAgo(record.reply.createdAt)}
                                                        </a>
                                                    </div>
                                                    <div className={style.userAction}>
                                                        <Button
                                                            size="small"
                                                            icon={<SendOutlined />}
                                                            onClick={() => {
                                                                Router.push(
                                                                    '/admin/content/comments/reply/' + record.reply._id
                                                                );
                                                            }}
                                                        >
                                                            Reply
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div
                                                    className={style.markdownText}
                                                    dangerouslySetInnerHTML={{
                                                        __html: xss(handleEmoji(record.reply.content)),
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div style={{ padding: '0 20px' }}>
                                    <div className={style.tip}>
                                        <CommentOutlined />
                                        Comment Content:
                                    </div>
                                    <div
                                        className="markdown-body"
                                        dangerouslySetInnerHTML={{
                                            __html: xss(handleEmoji(record.content)),
                                        }}
                                    ></div>
                                </div>
                            </React.Fragment>
                        );
                    }}
                    expandedRowKeys={expandedRowKeys}
                />
            </ActionCard>
        </BasicLayout>
    );
}
