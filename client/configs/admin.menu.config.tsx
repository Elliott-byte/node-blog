import React from 'react';
import {
    FormOutlined,
    CommentOutlined,
    AppstoreOutlined,
    FileOutlined,
    UserOutlined,
    SettingOutlined,
    ExceptionOutlined,
} from '@ant-design/icons';

const menuConfig = [
    {
        path: '/admin/content/articles',
        title: 'Article Management',
        icon: <FormOutlined />,
        childMenus: [
            {
                title: 'Add Article',
                path: '/admin/content/articles/edit',
                exact: true,
            },
            {
                title: 'Edit Article',
                path: '/admin/content/articles/edit/:id',
                exact: true,
            },
        ],
    },
    {
        path: '/admin/content/categories',
        title: 'Category Management',
        icon: <AppstoreOutlined />,
        childMenus: [
            {
                title: 'Add Category',
                path: '/admin/content/categories/edit',
                exact: true,
            },
            {
                title: 'Edit Category',
                path: '/admin/content/categories/edit/:id',
                exact: true,
            },
        ],
    },
    {
        path: '/admin/content/comments',
        title: 'Comment Management',
        icon: <CommentOutlined />,
        childMenus: [
            {
                title: 'Reply Comment',
                path: '/admin/content/comments/reply/:id',
                exact: true,
            },
        ],
    },
    {
        path: '/admin/code/static-files',
        title: 'Static Files',
        icon: <FileOutlined />,
        exact: true,
    },
    {
        path: '/admin/code/static-files/:folderId',
        exact: true,
    },
    {
        path: '/admin/user/person',
        icon: <UserOutlined />,
        title: 'Personal Configuration',
        hidden: true,
        exact: true,
    },
    {
        path: '/admin/settings',
        icon: <SettingOutlined />,
        title: 'Settings',
        exact: true,
    },
    {
        path: '/admin/adminlog',
        icon: <ExceptionOutlined />,
        title: 'Admin Log',
        exact: true,
    },
];

export default menuConfig;
