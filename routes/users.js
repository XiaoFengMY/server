var express = require("express");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var router = express.Router();
var operate = require("../operate/user");
let userModel = require("../model/User.js");
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

router.post("/showUserInfo", function (req, res) {
    const headers = req.headers;
    const token = headers["authorization"].split(" ")[1];
    jwt.verify(token, jwtKey, (err, payload) => {
        if (err) {
            res.json({
                code: 0,
                error: "验证失败",
            });
        } else {
            operate
                .findOne(
                    { id: req.body.userId },
                    {
                        useravatar: 1,
                        introduce: 1,
                        username: 1,
                        userFansNum: { $size: "$userFans" },
                        userFocusNum: { $size: "$userFocus" },
                        userPrestige: 1,
                        userFans: 1,
                    }
                )
                .then((result) => {
                    if (result) {
                        if (req.body.userId == payload.id) {
                            res.json({
                                code: 1,
                                isLoginUser: "loginUser",
                                success: "查询成功",
                                data: result,
                            });
                        } else {
                            if (result.userFans.indexOf(payload.id) > -1) {
                                res.json({
                                    code: 1,
                                    isLoginUser: "focusUser",
                                    success: "查询成功",
                                    data: result,
                                });
                            } else {
                                res.json({
                                    code: 1,
                                    isLoginUser: "unFocusUser",
                                    success: "查询成功",
                                    data: result,
                                });
                            }
                        }
                    } else {
                        res.json({
                            code: 0,
                            error: "用户不存在",
                        });
                        // res.redirect("/login");
                    }
                });
        }
    });
});

router.post("/getUserInfo", function (req, res) {
    const headers = req.headers;
    const token = headers["authorization"].split(" ")[1];
    jwt.verify(token, jwtKey, (err, payload) => {
        if (err) {
            res.json({
                code: 0,
                error: "用户未登录",
            });
        } else {
            operate
                .findOne(
                    { id: payload.id },
                    {
                        useravatar: 1,
                        introduce: 1,
                        username: 1,
                        email: 1,
                        phone: 1,
                        sex: 1,
                        birthday: 1,
                    }
                )
                .then((result) => {
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
        }
    });
});

router.post("/editUserInfo", function (req, res) {
    const headers = req.headers;
    const token = headers["authorization"].split(" ")[1];
    jwt.verify(token, jwtKey, (err, payload) => {
        if (err) {
            res.json({
                code: 0,
                message: "校验失败",
            });
        } else {
            userModel.updateOne(
                { id: payload.id },
                req.body.values.user,
                function (err, result) {
                    if (err) {
                        res.json({
                            code: 0,
                            message: "修改失败",
                        });
                    } else {
                        res.json({
                            code: 1,
                            message: "修改成功",
                        });
                    }
                }
            );
        }
    });
});

router.post("/focusUser", function (req, res) {
    const headers = req.headers;
    const token = headers["authorization"].split(" ")[1];
    jwt.verify(token, jwtKey, (err, payload) => {
        if (err) {
            res.json({
                code: 0,
                message: "未登录",
                isLoginUser: "unFocusUser",
            });
        } else {
            if (req.body.isLoginUser == "unFocusUser") {
                userModel.updateOne(
                    { id: payload.id },
                    { $addToSet: { userFocus: req.body.userId } },
                    function (err1, result1) {
                        if (err1) {
                            res.json({
                                code: 0,
                                message: "关注失败",
                                isLoginUser: "unFocusUser",
                            });
                        } else {
                            userModel.updateOne(
                                { id: req.body.userId },
                                { $addToSet: { userFans: payload.id } },
                                function (err2, result2) {
                                    if (err2) {
                                        res.json({
                                            code: 0,
                                            message: "关注失败",
                                            isLoginUser: "unFocusUser",
                                        });
                                    } else {
                                        res.json({
                                            code: 1,
                                            message: "关注成功",
                                            isLoginUser: "focusUser",
                                        });
                                    }
                                }
                            );
                        }
                    }
                );
            } else {
                userModel.updateOne(
                    { id: payload.id },
                    { $addToSet: { userFocus: req.body.userId } },
                    function (err1, result1) {
                        if (err1) {
                            res.json({
                                code: 0,
                                message: "取消关注失败",
                            });
                        } else {
                            userModel.updateOne(
                                { id: req.body.userId },
                                { $pull: { userFans: payload.id } },
                                function (err2, result2) {
                                    if (err2) {
                                        res.json({
                                            code: 0,
                                            message: "取消关注失败",
                                        });
                                    } else {
                                        res.json({
                                            code: 1,
                                            message: "取消关注成功",
                                        });
                                    }
                                }
                            );
                        }
                    }
                );
            }
        }
    });
});

module.exports = router;
