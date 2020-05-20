const net = require("net");
class ResponseParser {
  constructor() {
    this.WAITING_STATUS_LINE = 0; // 状态行开始
    this.WAITING_STATUS_LINE_END = 1; // 状态行结束
    this.WAITING_HEADER_NAME = 2; // headerName
    this.WAITING_HEADER_SPACE = 3; // 空格
    this.WAITING_HEADER_VALUE = 4; // headerValue
    this.WAITING_HEADER_LINE_END = 5; // 请求头行结束
    this.WAITING_HEADER_BLOCK_END = 6; // 请求头换行
    this.WAITING_BODY = 7; // 消息体
    this.current = this.WAITING_STATUS_LINE; // 当前的状态
    this.headers = {};
    this.headerName = "";
    this.headerValue = "";
    this.statusLine = "";
    this.bodyParser = null; // 消息解析器
  }

  get isFinished() {
    return this.bodyParser && this.bodyParser.isFinished;
  }

  get response() {
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/); // 匹配响应状态码和状态文本
    console.log(this.bodyParser.content);
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join(""),
    };
  }

  receive(string) {
    for (let i = 0; i < string.length; i++) {
      this.receiveChar(string.charAt(i));
    }
  }

  receiveChar(char) {
    if (this.current === this.WAITING_STATUS_LINE) {
      if (char === "\r") {
        this.current = this.WAITING_STATUS_LINE_END;
      } else if (char === "\n") {
        this.current = this.WAITING_HEADER_NAME;
      } else {
        this.statusLine += char;
      }
    } else if (this.current === this.WAITING_STATUS_LINE_END) {
      if (char === "\n") {
        this.current = this.WAITING_HEADER_NAME;
      }
    } else if (this.current === this.WAITING_HEADER_NAME) {
      if (char === ":") {
        this.current = this.WAITING_HEADER_SPACE;
      } else if (char === "\r") {
        this.current = this.WAITING_HEADER_BLOCK_END;
        if (this.headers["Transfer-Encoding"] === "chunked") {
          this.bodyParser = new TrunkedBodyParser();
        }
      } else {
        this.headerName += char;
      }
    } else if (this.current === this.WAITING_HEADER_BLOCK_END) {
      if (char === "\n") {
        this.current = this.WAITING_BODY;
      }
    } else if (this.current === this.WAITING_HEADER_SPACE) {
      if (char === " ") {
        this.current = this.WAITING_HEADER_VALUE;
      }
    } else if (this.current === this.WAITING_HEADER_VALUE) {
      if (char === "\r") {
        this.current = this.WAITING_HEADER_LINE_END;
        this.headers[this.headerName] = this.headerValue;
        this.headerName = this.headerValue = "";
      } else {
        this.headerValue += char;
      }
    } else if (this.current === this.WAITING_HEADER_LINE_END) {
      if (char === "\n") {
        this.current = this.WAITING_HEADER_NAME;
      }
    } else if (this.current === this.WAITING_BODY) {
      this.bodyParser.receiveChar(char);
    }
  }
}

// 消息体解析类
class TrunkedBodyParser {
  constructor() {
    this.WAITING_LENGTH = 0;
    this.WAITING_LENGTH_LINE_END = 1;
    this.READING_TRUNK = 2;
    this.WAITING_NEW_LINE = 3;
    this.WAITING_NEW_LINE_END = 4;
    this.length = 0;
    this.content = [];
    this.isFinished = false;
    this.current = this.WAITING_LENGTH;
  }
  receiveChar(char) {
    if (this.current === this.WAITING_LENGTH) {
      if (char === "\r") {
        if (this.length === 0) {
          this.isFinished = true;
        }
        this.current = this.WAITING_LENGTH_LINE_END;
      } else {
        // 十六进制运算
        this.length *= 16;
        this.length += parseInt(char, 16);
      }
    } else if (this.current === this.WAITING_LENGTH_LINE_END) {
      if (char === "\n") {
        this.current = this.READING_TRUNK;
      }
    } else if (this.current === this.READING_TRUNK) {
      if (/[^\r\n]/.test(char)) {
        this.content.push(char);
      }
      this.length--;
      if (this.length === 0) {
        this.current = this.WAITING_NEW_LINE;
      }
    } else if (this.current === this.WAITING_NEW_LINE) {
      if (char === "\r") {
        this.current = this.WAITING_NEW_LINE_END;
      }
    } else if (this.current === this.WAITING_NEW_LINE_END) {
      if (char === "\n") {
        this.current = this.WAITING_LENGTH;
      }
    }
  }
}
class Request {
  constructor(options) {
    const defaultOptions = {
      method: "GET",
      body: {},
      host: "localhost",
      path: "/",
      port: 80,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };
    options = {
      defaultOptions,
      ...options,
    };
    Object.keys(defaultOptions).forEach((key) => {
      this[key] = options[key];
    });
    // json串
    if (this.headers["Content-Type"] === "application/json") {
      this.bodyText = JSON.stringify(this.body);
    }
    // key=value串
    if (this.headers["Content-Type"] === "application/x-www-form-urlencoded") {
      this.bodyText = Object.keys(this.body)
        .map((key) => {
          return `${key}=${encodeURIComponent(this.body[key])}`;
        })
        .join("&");
      this.headers["Content-Length"] = this.bodyText.length;
    }
  }
  toString() {
    return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers)
  .map((key) => `${key}: ${this.headers[key]}`)
  .join("\r\n")}\r
\r
${this.bodyText}`;
  }
  send(connection) {
    return new Promise((resolve, reject) => {
      const parser = new ResponseParser();
      if (connection) {
        connection.write(this.toString());
      } else {
        connection = net.createConnection(
          {
            host: this.host,
            port: this.port,
          },
          () => {
            console.log("connected to server!");
            connection.write(this.toString());
          }
        );
        connection.on("data", (data) => {
          parser.receive(data.toString());
          console.log(parser.response, parser.isFinished, "headers");
          connection.end();
        });
        connection.on("error", (err) => {
          console.log("error", err);
          connection.end();
        });
        connection.on("end", () => {
          console.log("disconnected from server");
        });
      }
    });
  }
}

void (async function () {
  let request = new Request({
    method: "POST",
    host: "127.0.0.1",
    port: 9999,
    body: {
      name: "bar",
    },
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    path: "/",
  });
  await request.send();
})();
