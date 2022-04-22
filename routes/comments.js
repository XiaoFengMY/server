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
            let param = {
                commentContent: req.body.content,
                commentAuthor: payload.userId,
            };
            console.log("param: ", param);
            CommentModel.findOne({ id: req.body.id }, { id: 1 }, (result) => {
                if (result) {
                    CommentModel.findOneAndUpdate(
                        { id: req.body.id },
                        { $addToSet: { commentList: param } },
                        function (err, doc) {
                            if (doc) {
                                res.json({
                                    code: 1,
                                    success: "评论成功",
                                });
                            } else {
                                res.json({
                                    code: 0,
                                    err: err,
                                    error: "评论失败",
                                });
                            }
                        }
                    );
                } else {
                    var data = {
                        id: req.body.id,
                        commentList: [
                            {
                                commentAuthor: payload.userId,
                                commeContent: req.body.content,
                            },
                        ],
                    };
                    CommentModel.create(data, (err, docs) => {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(docs);
                        }
                    });
                }
            });
        }
    });

    /* CommentModel.findOneAndUpdate(
        { id: param.id },
        { $addToSet: { commentList: param } },
        function (err, doc) {
            console.log("id: ", param.id);
            console.log("doc: ",doc);
            console.log("err: ",err);
            if (doc) {
                res.json({
                    code: 1,
                    success: "评论成功",
                });
            } else {
                res.json({
                    code: 0,
                    err: err,
                    error: "评论失败",
                });
            }
        }
    ); */
});

router.post("/blogCommentList", (req, res, next) => {
    let param = {
        id: req.body.id,
    };
    CommentModel.find(param, {}, function (err, result) {
        console.log("result: ", result);
        console.log("errorssss: ", err);
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
    }).populate("commentList.username", "username _id id useravatar ");
    /* CommentModel.findOne(param)
        .populate("commentList.username")
        .exec(function (result, err) {
            console.log("result: ", result);
            console.log("param: ",param)
            console.log("errorssss: ", err);
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
        }); */
});

module.exports = router;
