import React from 'react';
import style from './style.module.scss';
import BackTopBtn from '../back-top-button';
import BlogRuningTime from '../blog-runing-time';
import { EmailIcon, WechatIcon, QQIcon, GithubIcon } from '../../icons';
import { useFetchConfigQuery } from '../../api';
import { Space } from 'antd';
import LogoSvg from '../logo-svg';

export const AppFooter = () => {
    const { data: config } = useFetchConfigQuery();
    return (
        <footer className={style.appFooter} id="app-footer">
            <BackTopBtn></BackTopBtn>
            <div className={style.info}>
                <section className={style.content}>
                    <div className={style.siteInfo}>
                        <div className={style.svgWrap}>
                            <LogoSvg></LogoSvg>
                            <p className={style.siteTitle}>Welcome to {config.siteTitle} 😀</p>
                        </div>
                        <p className={style.siteTitle}></p>
                    </div>
                    <div className={style.contact}>
                        <div className={style.contactTitle}>Contact us: </div>
                        <div className={style.contactList}>
                            <a href="mailto:bs32g1038@163.com">
                                <EmailIcon></EmailIcon>
                            </a>
                            <a>
                                <WechatIcon></WechatIcon>
                            </a>
                            <a>
                                <QQIcon></QQIcon>
                            </a>
                            <a href={config.projectGithub}>
                                <GithubIcon></GithubIcon>
                            </a>
                        </div>
                    </div>
                    <div className={style.statement}>
                        <Space
                            style={{
                                fontSize: 12,
                            }}
                        >
                            <span>Running time：</span>
                            <BlogRuningTime></BlogRuningTime>
                        </Space>
                    </div>
                </section>
                <section className={style.support}>
                    <h3>商务合作</h3>
                    <p>承包前后端业务，联系前，请明确你的需求，最低报价，工期。</p>

                    <div className={style.supportList}>
                        <a href="https://nestjs.com">
                            <img src={require('@blog/client/assets/svgs/logo-nestjs.svg')} alt="" />
                        </a>
                        <a href="https://react.docschina.org">
                            <img src={require('@blog/client/assets/svgs/logo-react.svg')} alt="" />
                        </a>
                        <a href="https://nodejs.org/en">
                            <img src={require('@blog/client/assets/svgs/logo-nodejs.svg')} alt="" />
                        </a>
                        <a href="https://ant.design">
                            <img src={require('@blog/client/assets/svgs/logo-ant-design.svg')} alt="" />
                        </a>
                    </div>
                </section>
            </div>
            <div className={style.invite}>
                <h3>Business Collaboration</h3>
                <p>
                    We undertake front-end and back-end projects. Please clarify your requirements, minimum quote, and
                    timeline before contacting us.
                </p>
            </div>
        </footer>
    );
};
