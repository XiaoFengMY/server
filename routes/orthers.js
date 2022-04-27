const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const formidable = require("formidable");
let BlogModel = require("../model/Blog.js");
let userModel = require("../model/User.js");
const jwtKey = "hello";

router.post("/upload", function (req, res, next) {
    const form = formidable({
        multiples: true,
        uploadDir: path.join(__dirname, "../public/images"),
        keepExtensions: true,
    });

    form.parse(req, function (err, fileds, files) {
        if (err) {
            res.json({
                code: 0,
                msg: "文件上传失败",
            });
        } else {
            res.json({
                code: 1,
                msg: "文件上传成功",
                name: files.file.newFilename,
                // imgurl: files.logo.filepath,
            });
        }
    });
});

router.get("/likeBlog", function (req, res, next) {
    const headers = req.headers;
    const token = headers["authorization"].split(" ")[1];
    jwt.verify(token, jwtKey, (err, payload) => {
        if (err) {
            res.json({
                code: 0,
                message: "登录已过期",
            });
        } else {
            if (req.query.isLiked == "false") {
                userModel.updateOne(
                    { id: payload.id },
                    { $addToSet: { userLikeBlogs: req.query.blogId } },
                    function (err) {
                        if (err) {
                            res.json({
                                code: 0,
                                message: "点赞失败",
                            });
                        } else {
                            BlogModel.updateOne(
                                { id: req.query.blogId },
                                { $inc: { blogLikes: +1, blogHot: +5 } },
                                function (error) {
                                    if (error) {
                                        res.json({
                                            code: 0,
                                            message: "点赞失败",
                                        });
                                    } else {
                                        res.json({
                                            code: 1,
                                            message: "点赞成功",
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
                    { $pull: { userLikeBlogs: req.query.blogId } },
                    function (err) {
                        if (err) {
                            res.json({
                                code: 0,
                                message: "取消点赞失败",
                            });
                        } else {
                            BlogModel.updateOne(
                                { id: req.query.blogId },
                                { $inc: { blogLikes: -1, blogHot: -2 } },
                                function (error) {
                                    if (error) {
                                        res.json({
                                            code: 0,
                                            message: "取消点赞失败",
                                        });
                                    } else {
                                        res.json({
                                            code: 1,
                                            message: "取消点赞成功",
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

router.get("/isLiked", function (req, res, next) {
    const headers = req.headers;
    const token = headers["authorization"].split(" ")[1];
    jwt.verify(token, jwtKey, (err, payload) => {
        if (err) {
            res.json({
                code: 0,
                message: "登录已过期",
            });
        } else {
            userModel.findOne(
                {
                    id: payload.id,
                    userLikeBlogs: { $elemMatch: { $eq: req.query.blogId } },
                },
                { userLikeBlogs: 1 },
                function (error, result) {
                    if (result) {
                        res.json({
                            code: 1,
                            message: "已点赞",
                            isLiked: true,
                        });
                    } else {
                        res.json({
                            code: 0,
                            message: "未点赞",
                            isLiked: false,
                        });
                    }
                }
            );
        }
    });
});

router.get("/collectBlog", function (req, res, next) {
    const headers = req.headers;
    const token = headers["authorization"].split(" ")[1];
    jwt.verify(token, jwtKey, (err, payload) => {
        if (err) {
            res.json({
                code: 0,
                message: "登录已过期",
            });
        } else {
            if (req.query.isCollected == "false") {
                userModel.updateOne(
                    { id: payload.id },
                    { $addToSet: { userCollectBlogs: req.query.blogId } },
                    function (err) {
                        if (err) {
                            res.json({
                                code: 0,
                                message: "收藏失败",
                            });
                        } else {
                            BlogModel.updateOne(
                                { id: req.query.blogId },
                                { $inc: { blogCollects: +1, blogHot: +15 } },
                                function (error) {
                                    if (error) {
                                        res.json({
                                            code: 0,
                                            message: "收藏失败",
                                        });
                                    } else {
                                        res.json({
                                            code: 1,
                                            message: "收藏成功",
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
                    { $pull: { userCollectBlogs: req.query.blogId } },
                    function (err) {
                        if (err) {
                            res.json({
                                code: 0,
                                message: "取消收藏失败",
                            });
                        } else {
                            BlogModel.updateOne(
                                { id: req.query.blogId },
                                { $inc: { blogCollects: -1, blogHot: -8 } },
                                function (error) {
                                    if (error) {
                                        res.json({
                                            code: 0,
                                            message: "取消收藏失败",
                                        });
                                    } else {
                                        res.json({
                                            code: 1,
                                            message: "取消收藏成功",
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

router.get("/isCollected", function (req, res, next) {
    const headers = req.headers;
    const token = headers["authorization"].split(" ")[1];
    jwt.verify(token, jwtKey, (err, payload) => {
        if (err) {
            res.json({
                code: 0,
                message: "登录已过期",
            });
        } else {
            userModel.findOne(
                {
                    id: payload.id,
                    userCollectBlogs: { $elemMatch: { $eq: req.query.blogId } },
                },
                { userCollectBlogs: 1 },
                function (error, result) {
                    if (result) {
                        res.json({
                            code: 1,
                            message: "已收藏",
                            isCollected: true,
                        });
                    } else {
                        res.json({
                            code: 0,
                            message: "未收藏",
                            isCollected: false,
                        });
                    }
                }
            );
        }
    });
});

router.get("/getImg", function (req, res) {
    let img = req.query.img;
    let path = `public/images/${img}`;
    const data = fs.readFile(path, function (err, data) {
        if (err) {
            res.send("读取错误");
        } else {
            res.send(data);
        }
    });
});

module.exports = router;
