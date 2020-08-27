const querystring = require('querystring');
const http = require('http');
const fs = require('fs');
const archiver = require('archiver');
const child_process = require('child_process');


//登录获取发布权限
let redirect_uri = encodeURIComponent('http://localhost:8081/auth');
child_process.exec(`open https://github.com/login/oauth/authorize?client_id=Iv1.c51b99c8fbc711e6&redirect_uri=redirect_uri&login=RamboGit&state=change123`);

//启动监听，监听 publish-server 发送过来的 token
const server = http.createServer((request, response) => {
    let token = request.url.match(/token=([^&]+)/);
    if(token){
        console.log('access_token', token[1]);
        console.log('real publish!!!');
        sendProjectData(response, token[1]);
    }
});
server.listen(8080);

function sendProjectData(response, token) {
    const options = {
        hostname: '127.0.0.1',
        port: 8081,
        path: '/publish',
        method: 'POST',
        headers: {
            'token' : token,
            'Content-Type': 'application/octet-stream'
        }
    };
    
    let archive = archiver('zip', {
        zlib: { level: 9 }
    });
    archive.directory('./package', false);
    
    const req = http.request(options, (res) => {

        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            console.log(`响应主体: ${chunk}`);
        });
        res.on('end', () => {
            console.log('响应中已无数据');
            response.end();
            // server.close();
        });
    });
    
    req.on('error', (e) => {
        console.error(`请求遇到问题: ${e.message}`);
    });
    
    //发送打包数据
    archive.pipe(req);
    archive.finalize();
    archive.on('end', () => {
        console.log('打包完成---', archive.pointer());
        req.end();
    });
    archive.on('error', function (err) {
        throw err;
    });
}