const http = require('http')
const server = http.createServer((req, res) => {
  const reqHeaders = req.headers
  console.log('req header', reqHeaders)
  res.setHeader('content-type', 'text/html')
  res.setHeader('X-FOO', 'bar')
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end(
    `
<html maaa=a >
<head>
    <style>
    body div #myid {
      width: 100px;
      background-color: #432322;
    }
    body div .a {
      width: 100px;
      background-color: #ff5000;
    }

    body div .b {
      width: 100px;
      background-color: #787212;
    }
    </style>
    <body>
      <div>
        <img id="myid" class="a b"/>
        <img />
      </div>
    </body>
</head>
</html>
`
  )
})

server.listen(9999, () => {
  console.log('server started at port 9999')
})
