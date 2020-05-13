# 每周总结可以写在这里

# 浏览器工作原理(一)

## Http 请求组成

请求行-请求头-请求体(query params 串)

```
POST / HTTP/1.1
Connection: keep-alive
Content-Length: 55
Content-Type: application/json

abc=123&bcd=%3A%3B
```

> 注：快速获取 Http 请求头原生报文方式，Network->右键->Copy->Copy request Headers

### ReuqestLine

请求方法 url 协议/版本号

```
POST    /       HTTP/1.1
method  path   httpVersion
```

> method 包含 OPTIONS GET POST HEAD PUT DELETE TRACE CONNECT

- OPTIONS: preflight 请求(预检请求，通常是检测服务器性能(支持哪些方法，或者对应特殊的资源对象采用特殊的操作)，CORS 复杂请求)
- GET： 向服务器请求资源 (幂等) (遵循 HTTP/1.1 规范，就必须实现 GET 方法。)
- HEAD:HEAD 方法与 GET 方法的行为很类似，但服务器在响应中只返回首部(遵循 HTTP/1.1 规范，就必须实现 HEAD 方法。)
- POST： 向 Web 服务器发送数据让 Web 服务器进行处理
- PUT: PUT 方法会向服务器写入文档
- TRACE: 追踪请求 (检测请求是否中途被篡改过或者毁坏)
- DELETE:请求服务器删除指定的资源
- CONNECT:能够将连接改为管道方式的代理服务器。通常用于 SSL 加密服务器的链接与非加密的 HTTP 代理服务器的通信。(CONNECT 方法是 HTTP/1.1 协议预留的，)

### Request Headers[POST method]

- **Content-Length**
  > 表示 body 内容长度
- **Content-Type**
  > 表示请求内容的类型
  - application/json
  - application/x-www-form-urlencoded
  - text/xml
  - multipart/formdata

### Body

```
application/x-www-form-urlencoded

abc=123&bcd=%3A%3B
```

```
application/json

JSON.stringify(json)
```

## HTTP 响应组成

// 状态行-响应头- 消息实体

```
HTTP/1.1 200 OK // 状态行
Content-Type: application/json; charset=utf-8  // 响应头
Content-Length: 798

// 消息实体
{"code":0,"data":{"list":[...]}}

```

### StatusLine

```
HTTP/1.1        200       OK
httpVersion statusCode statusText
```

### Response Headers

```
Content-Type: application/json; charset=utf-8
Content-Length: 798
```

- **Content-Type**
  > 响应内容的类型及编码方式
- **Content-Length**
  > 响应内容的长度
- **Transfer-Encoding**
  > 响应内容的传输格式

### Response Body

> 根据 Content-Type 和 Transfer-Encoding 等属性确定 Body

```
Content-Type为application/json：
{"code":0,"data":{"list":[...]}}

Transfer-Encoding为chunked时：
10 // chunk长度
1234567890 //chunk内容
0 // 内容结束
```

## 处理过程

### 请求处理过程

1. 创建 TCP 客户端
2. 向服务端发送 RequestLine、RequestHeaders、RequestBody
3. 监听服务端返回数据并处理

### 响应处理过程

1. 客户端接收到服务端返回数据
2. 利用状态机解析 ResponseStatusLine、ResponseHeaders
3. 根据 ResponseHeaders 中 Transfer-Encoding 决定采用哪种方式解析 ResponseBody
4. 利用状态机解析 ResponseBody
