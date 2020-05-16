const http = require("http");

const hostname = "127.0.0.1";
const port = 9999;

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.setHeader("X-Foo", "bar");
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("hello world!\n");
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
