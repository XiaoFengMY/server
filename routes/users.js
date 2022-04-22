var express = require("express");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var router = express.Router();
var operate = require("../operate/user");
var jwtKey = "hello";

/* GET users listing. */

router.post("/regist", function (req, res, next) {
    let param = {};
    param.username = req.body.username;
    param.password = req.body.password;
    param.rePassword = req.body.rePassword;
    param.email = req.body.email;
    param.phone = req.body.phone;
    param.agreement = req.body.agreement;
    operate.findOne({ username: param.username }).then((result) => {
        if (result) {
            res.json({
                code: 0,
                error: "用户名已存在!",
            });
        } else {
            operate.save(param).then((result) => {
                if (result) {
                    res.json({
                        code: 1,
                        success: "注册成功",
                        username: req.session.username,
                    });
                } else {
                    res.json({
                        code: 0,
                        error: "注册失败",
                    });
                }
            });
        }
    });
});

router.post("/login", function (req, res, next) {
    let param = {
        username: req.body.username,
        password: req.body.password,
    };
    operate.findOne({ username: param.username }).then((result) => {
        if (result) {
            const isPasswordValid = bcrypt.compareSync(
                req.body.password,
                result.password
            );
            if (isPasswordValid) {
                jwt.sign(
                    {
                        username: param.username,
                        id: result.id,
                        image: result.useravatar,
                        userId: result._id,
                    },
                    jwtKey,
                    { expiresIn: "72h" },
                    (err, token) => {
                        res.json({
                            code: 1,
                            success: "登录成功",
                            token: token,
                        });
                    }
                );
            } else {
                res.json({
                    code: 0,
                    error: "密码错误",
                });
            }
        } else {
            res.json({
                code: 0,
                error: "登录失败",
            });
            // res.redirect("/login");
        }
    });
});

router.post("/loginStatus", function (req, res) {
    const headers = req.headers;
    const token = headers["authorization"].split(" ")[1];
    jwt.verify(token, jwtKey, (err, payload) => {
        if (err) {
            res.json({
                code: 0,
                error: "未登录",
            });
        } else {
            operate.findOne({ username: payload.username }).then((result) => {
                if (result) {
                    var data = {
                        id: result.id,
                        username: result.username,
                        useravatar: result.useravatar,
                    };
                    res.json({
                        code: 1,
                        success: "查询成功",
                        data: data,
                    });
                } else {
                    res.json({
                        code: 0,
                        error: "查询失败",
                    });
                    // res.redirect("/login");
                }
            });
        }
    });
});

router.post("/showAvatar", function (req, res) {
    operate
        .findOne(
            { id: req.body.id },
            {
                useravatar: 1,
                introduce: 1,
                username: 1,
                userFans: { $size: "$userFans" },
                userFocus: { $size: "$userFocus" },
                userPrestige: 1,
            }
        )
        .then((result) => {
            console.log("resulit", result)
            if (result) {
                res.json({
                    code: 1,
                    success: "查询成功",
                    data: result,
                });
            } else {
                res.json({
                    code: 0,
                    error: "用户不存在",
                });
                // res.redirect("/login");
            }
        });
});

module.exports = router;
