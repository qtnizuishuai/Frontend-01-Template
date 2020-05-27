const http = require('http')
const fs = require('fs')
const { extname } = require('path')
const mime = require('./config/mime.js')
const now = new Date().toGMTString();
let initData = {
    contentType:'',
    cacheControl:''
}
const server = http.createServer((req, res) => {
    const reqHeaders = req.headers
    console.log('req header', reqHeaders)
    filePath = '.' + req.url.split('?')[0];
    let {contentType, cacheControl} = initData;
    if (req.url === '/') filePath = './index.html'
    fs.readFile(filePath, (err, data) => {
        if (err) {
            data = '404'
            contentType = 'text/plain'
        } else {
            // extname匹配后缀
            contentType = mime[extname(filePath)] || 'text/plain'
        }
        if (contentType === mime['.html']) {
            cacheControl = 'private,no-cache,max-age=300000'
        } else {
            cacheControl = 'public,max-age=300000'
        }

        res.writeHead(
            err ? 404 : 200, {
            'Content-Type': `${contentType}; charset=utf-8`,
            'Content-Length': Buffer.byteLength(data),
            'Cache-Control': cacheControl,
            'Last-Modified': now,
            'Transfer-Encoding': 'chunked'
        }
        )
        res.end(data)
        initData = {
            contentType:'',
            cacheControl:''
        };
    })
    // res.setHeader('content-type', 'text/html')
    // res.setHeader('X-FOO', 'bar')
    // res.writeHead(200, { 'Content-Type': 'text/plain' })
//     res.end(
//         `
// <html maaa=a >
// <head>
//     <style>
//     body div #myid {
//       width: 100px;
//       background-color: #432322;
//     }
//     body div .a {
//       width: 100px;
//       background-color: #ff5000;
//     }

//     body div .b {
//       width: 100px;
//       background-color: #787212;
//     }
//     </style>
//     <body>
//       <div>
//         <img id="myid" class="a b"/>
//         <img />
//       </div>
//     </body>
// </head>
// </html>
// `
//     )
})

server.listen(9999, () => {
    console.log('server started at port 9999')
})
