import React, { useEffect, useState } from 'react';
import isLength from 'validator/lib/isLength';
import { nanoid } from 'nanoid';
import Emoji from './emoji';
import { USER_COMMENT_INFO_KEY } from './constant';
import axios from '@blog/client/web/utils/axios';
import { Alert, Tooltip, Input, Button } from 'antd';
import style from './style.module.scss';
import Avatar from 'boring-avatars';

interface Props {
    url: string;
    parentId?: string;
    replyId?: string;
    articleId?: string;
}

export const CommentForm = (props: Props) => {
    const [userInfo, setUserInfo] = useState<{ nickName: string; email: string }>({
        nickName: '',
        email: '',
    });
    const [content, setContent] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [buttonLoading, setButtonLoading] = useState(false);
    const onEmojiInput = (text: string) => {
        setContent((val) => {
            return val + text;
        });
    };
    useEffect(() => {
        const info = localStorage.getItem(USER_COMMENT_INFO_KEY);
        if (info) {
            const data: any = JSON.parse(info);
            setUserInfo(data);
        } else {
            const nickName = nanoid(6);
            const data = {
                nickName,
                email: 'visitor@lizc.email',
            };
            localStorage.setItem(USER_COMMENT_INFO_KEY, JSON.stringify(data));
            setUserInfo(data);
        }
    }, []);

    const submit = () => {
        const data = {
            nickName: userInfo.nickName,
            email: userInfo.email,
            article: props.articleId,
            content,
        };
        if (props.parentId) {
            Object.assign(data, {
                parentId: props.parentId,
            });
        }
        if (props.replyId) {
            Object.assign(data, {
                reply: props.replyId,
            });
        }
        if (!isLength(data.content, { min: 1 })) {
            return setErrorMessage('At least 6 character！');
        } else if (!isLength(data.content, { max: 490 })) {
            return setErrorMessage('Max character is 490！');
        }
        setButtonLoading(true);
        axios
            .post(props.url, data)
            .then(() => {
                location.reload();
            })
            .catch(() => {
                setErrorMessage('The server is not working, please try again later！');
            });
    };
    return (
        <div>
            <Alert
                message={
                    <div>
                        Current comment mode: Guest mode. The system will automatically generate relevant data
                        information.
                        <Tooltip placement="topLeft" title="">
                            <a>Details。</a>
                        </Tooltip>
                    </div>
                }
                type="warning"
                showIcon
            />
            <div className={style.userInfo}>
                <span className={style.userInfoText}>Visitor Account：</span>
                <Avatar size={20} name={userInfo.nickName} variant="beam" />
                <span className={style.userInfoText}>{userInfo.nickName}</span>
            </div>
            <div className={style.inputWrap}>
                {errorMessage && <Alert message={errorMessage} type="warning" showIcon />}
                <Input.TextArea
                    value={content}
                    placeholder="Good Idea~"
                    autoSize={{ minRows: 3, maxRows: 3 }}
                    onChange={(event) => {
                        setContent(event.target.value);
                    }}
                />
                <Emoji
                    onInput={(text) => {
                        onEmojiInput(text);
                    }}
                ></Emoji>
                <div className={style.commentFormFooter}>
                    <Button loading={buttonLoading} size="small" type="primary" onClick={() => submit()}>
                        Submit
                    </Button>
                </div>
            </div>
        </div>
    );
};
