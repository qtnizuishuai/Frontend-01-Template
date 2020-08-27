//1. 获取 code
// publish-tool 唤起浏览器
{
    let req = new XMLHttpRequest();
    // req.setRequestHeader('Accept', "application/vnd.github.v3+json");
    req.responseType = 'json';
    req.timeout = 30000;
    req.open('GET', `https://github.com/login/oauth/authorize?client_id=Iv1.c51b99c8fbc711e6&redirect_uri=http://localhost&login=RamboGit&state=change`);
    //code=d8962557846690dfed21
    req.onreadystatechange = function () {
        if(req.readyState === 4){
            console.log(JSON.parse(req.response));
        }
    };
    req.send();
}
//code = 40e4a6b740e4a3a89d5f
//2. 获取 access_token
// publish-server
{
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = 3000;
    xhr.open('POST', `https://github.com/login/oauth/access_token?client_id=Iv1.c51b99c8fbc711e6&client_secret=8b236502d70cf3ea3b6cee8b8054ea4d77ca53ee&code=40e4a6b740e4a3a89d5f&redirect_uri=http://localhost&state=change`, true);

    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4){
            console.log(JSON.parse(xhr.response));
        }
    }
    xhr.send(null);

//access_token = e1e9962acc1065bea7fd92d03b2391fc992ef993
// 3. 使用 access_token 调用 githubAPI
//publish-tool/publish-server
{
    let xhr = new XMLHttpRequest();
    xhr.timeout = 3000;
    xhr.open('GET', `https://api.github.com/user`, true);
    xhr.setRequestHeader("Authorization","token e1e9962acc1065bea7fd92d03b2391fc992ef993");

    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4){
            console.log(xhr.response);
        }
    }
    xhr.send(null);
}