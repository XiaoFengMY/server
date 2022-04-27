var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
let CommentModel = require("../model/Comment.js");
var jwtKey = "hello";

router.post("/blogComment", (req, res, next) => {
    const headers = req.headers;
    const token = headers["authorization"].split(" ")[1];
    jwt.verify(token, jwtKey, (err, payload) => {
        if (err) {
            res.json({
                code: 3,
                message: "未登录不能评论",
            });
        } else {
            if (req.body.commentId) {
                CommentModel.updateOne(
                    { id: req.body.commentId },
                    {
                        $push: {
                            children: {
                                commentContent: req.body.content,
                                username: payload.userId,
                            },
                        },
                    },
                    (error) => {
                        if (error) {
                            res.json({
                                code: 0,
                                message: "评论失败",
                            });
                        } else {
                            res.json({
                                code: 1,
                                message: "评论成功",
                            });
                        }
                    }
                )
            } else {
                let param = {
                    commentContent: req.body.content,
                    blogId: req.body.id,
                    username: payload.userId,
                };
                CommentModel.create(param, (err) => {
                    if (err) {
                        res.json({
                            code: 0,
                            message: "评论失败",
                        });
                    } else {
                        res.json({
                            code: 1,
                            message: "评论成功",
                        });
                    }
                });
            }
        }
    });
});

router.post("/blogCommentList", (req, res, next) => {
    let param = {
        blogId: req.body.blogId,
    };
    CommentModel.find(param, {}, function (err, result) {
        if (result) {
            res.json({
                code: 1,
                success: "查找成功",
                data: result,
            });
        } else {
            res.json({
                code: 0,
                err: err,
                error: "查找失败",
            });
        }
    }).populate("username children.username", "username _id id useravatar ");
});

module.exports = router;
