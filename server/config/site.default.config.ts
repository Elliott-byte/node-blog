const smptConfig = {
    isEnableSmtp: false,
    smtpHost: 'smtp.163.com',
    smtpSecure: true,
    smtpPort: 465,
    smtpAuthUser: 'your email address like : bs32g1038@163.com',
    smtpAuthpass: 'your email password',
};

export type SmptConfigType = typeof smptConfig;

const config = {
    siteTitle: `Elliott' Blog`,
    siteMetaKeyWords: `Elliott's blog, web development, nodejs development, fronend, backend, docker, daily life`,
    siteMetaDescription: `Elliott's personal blog, share full stack development, docker, daily life and so on.`,
    siteLogo: '/static/logo.svg',

    siteIcp: '',
    icpGovCn: '',

    github: '',
    projectGithub: '',

    siteDomain: process.env.NODE_ENV === 'production' ? 'elliott.cafe' : 'http://127.0.0.1:3000',

    ...smptConfig,
};

export type configType = typeof config;

export default config;
