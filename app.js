const createError = require("http-errors");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var blogsRouter = require("./routes/blogs");
var commentsRouter = require("./routes/comments");
var orthersRouter = require("./routes/orthers");
var testApiRouter = require("./routes/testApi");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(express.static('public/images'));

app.use(cookieParser('blogDIVA'));
app.use(
    session({
        // 可选，设置个session的名字
        name: "blog",
        // 是否强制保存会话，即使未被修改也要保存。默认为true
        // 用于生成会话签名的密钥,必须项
        secret: "blogDIVA",
        //必选，建议false，只要保存登录状态的用户，减少无效数据。
        resave: false,
        // 强制将“未初始化”的会话保存到存储中。 当会话是新的但未被修改时，它是未初始化的。 选择 false 对于实现登录会话、减少服务器存储使用或遵守在设置 cookie 之前需要许可的法律很有用。 选择 false 还有助于解决客户端在没有会话的情况下发出多个并行请求的竞争条件。默认值为 true。
        saveUninitialized: false,
        cookie: {
            //domain: "127.0.0.1",
            secure: false,
            maxAge: 1000 * 60 * 60 * 24 * 7,
        },
        // store: MongoStore.create({ mongoUrl: 'mongodb://admin:admin@localhost:27017/xiaofengBlog' })
    })
);

/* app.use(session({
    
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }
  })) */

app.use(
    cors({
        credentials: true,
    })
);
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/blogs", blogsRouter);
app.use("/comments", commentsRouter);
app.use("/orthers", orthersRouter);
app.use("/testApi", testApiRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
