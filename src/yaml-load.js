const yamlString = `# 服务端口 默认：3000 1-65535
SERVER_PORT: 3000
# 是否打开文档 默认：true
PRO_DOC: true
# 是否直接通过前端访问 oss
WEB_OSS: false
# Token 生成加盐 默认：'secret-key'
TOKEN_SECRET: 'secret-key'
# Api 加密 RSA 私钥 默认：请查看源码
API_SIGN_RSA_PRIVATE_KEY: ''
# Api 加密请求过期间隔，超出即被认为为过期请求 默认：15 单位：s
API_SIGN_TIME_OUT: 15`

const yaml = require('js-yaml');

const doc = yaml.load(yamlString);
console.log(doc);
//  doc ==> {
//     SERVER_PORT: 3000,
//     PRO_DOC: true,
//     WEB_OSS: false,
//     TOKEN_SECRET: 'secret-key',
//     API_SIGN_RSA_PRIVATE_KEY: '',
//     API_SIGN_TIME_OUT: 15
//   }

const clc = require('cli-color')
console.log(clc.magenta("Underlined red text on white background."));

var log = require('fancy-log');

log.info('a message');
// [16:27:02] a message

log.error('oh no!');
// [16:27:02] oh no!
