var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
var operate = require("../operate/blog");
let BlogModel = require("../model/Blog.js");
let userModel = require("../model/User.js");
var jwtKey = "hello";

/* GET home page. */
router.get("/", function (req, res, next) {
    res.render("index", { title: "Express" });
});

router.post("/addBlog", function (req, res, next) {
    const headers = req.headers;
    const token = headers["authorization"].split(" ")[1];
    jwt.verify(token, jwtKey, (err, payload) => {
        if (err) {
            res.json({
                code: 0,
                error: "文章添加失败",
            });
        } else {
            if (req.body.id) {
                var id = req.body.id;
                let param = {};
                param.username = payload.userId;
                param.blogTitle = req.body.blogTitle;
                param.blogSort = req.body.blogSort;
                param.blogTabs = req.body.blogTabs;
                param.blogRecommend = req.body.blogRecommend;
                param.blogContent = req.body.blogContent;
                param.blogSee = req.body.blogSee;
                param.updateTime = new Date();
                // param.image = req.body.image[0].thumbUrl;
                operate.update({ id: id }, param).then((result, error) => {
                    if (result) {
                        res.json({
                            code: 1,
                            success: "保存成功",
                        });
                    } else {
                        res.json({
                            code: 0,
                            err: error,
                            error: "保存失败",
                        });
                    }
                });
            } else {
                let param = {};
                param.username = payload.userId;
                param.blogTitle = req.body.blogTitle;
                param.blogSort = req.body.blogSort;
                param.blogTabs = req.body.blogTabs;
                param.blogRecommend = req.body.blogRecommend;
                param.blogContent = req.body.blogContent;
                param.blogSee = req.body.blogSee;
                // param.image = req.body.image[0].thumbUrl;
                operate.save(param).then((result, error) => {
                    if (result) {
                        res.json({
                            code: 1,
                            success: "保存成功",
                        });
                    } else {
                        res.json({
                            code: 0,
                            err: error,
                            error: "保存失败",
                        });
                    }
                });
            }
        }
    });
});

router.post("/editBlog", (req, res, next) => {
    let param = {
        id: req.body.id,
    };
    const headers = req.headers;
    const token = headers["authorization"].split(" ")[1];
    jwt.verify(token, jwtKey, (err, payload) => {
        if (err) {
            res.json({
                code: 3,
                message: "登录已过期",
            });
        } else {
            operate.findOne({ id: param.id }).then((result, error) => {
                if (result.username.toString() == payload.userId) {
                    res.json({
                        code: 1,
                        success: "编辑中",
                        data: result,
                    });
                } else {
                    res.json({
                        code: 0,
                        err: error,
                        error: "不能编辑该文章",
                    });
                }
            });
        }
    });
});

router.post("/search", (req, res, next) => {
    let searchValue = req.body.title;
    var str = ".*" + searchValue + ".*$";
    var reg = new RegExp(str);
    // $options:'i' 表示忽略大小写
    BlogModel.find(
        { blogTitle: { $regex: reg, $options: "i" } },
        {
            blogTitle: 1,
            id: 1,
            username: 1,
            blogTabs: 1,
            blogLikes: 1,
            blogCollects: 1,
        },
        function (err, result) {
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
        }
    ).populate("username", "username _id id useravatar ");
});

router.post("/deleteBlog", (req, res, next) => {
    let param = {
        id: req.body.id,
    };
    const headers = req.headers;
    const token = headers["authorization"].split(" ")[1];
    jwt.verify(token, jwtKey, (err, payload) => {
        if (err) {
            res.json({
                code: 3,
                message: "登录已过期",
            });
        } else {
            operate.remove({ id: param.id }).then((result, error) => {
                if (result.username == payload.username) {
                    res.json({
                        code: 1,
                        message: "删除成功",
                    });
                } else {
                    res.json({
                        code: 0,
                        err: error,
                        message: "不能删除该文章",
                    });
                }
            });
        }
    });
});

router.get("/showBlogs", (req, res, next) => {
    var param = {};
    var listSort = {};
    if (req.query.sort == "nowTime") {
        listSort.id = -1;
    } else if (req.query.sort == "comprehensive") {
        listSort.blogHot = -1;
    }else if(req.query.sort == "reading"){
        listSort.blogReadings = -1;
    } else {
        listSort.id = 1;
    }
    if (req.query.classify == "全部") {
        param.blogSee = true;
    } else {
        param.blogSee = true;
        param.blogSort = req.query.classify;
    }
    BlogModel.find(
        param,
        {
            blogTitle: 1,
            id: 1,
            username: 1,
            blogTabs: 1,
            blogLikes: 1,
            blogCollects: 1,
            blogRecommend: 1,
        },
        { sort: listSort },
        function (err, result) {
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
        }
    ).populate("username", " username _id id useravatar introduce ");
});

router.get("/hotBlogList", (req, res, next) => {
    operate
        .find(
            {},
            {
                blogTitle: 1,
                id: 1,
            },
            { sort: { blogLikes: -1 }, limit: 10 }
        )
        .then((result, error) => {
            if (result) {
                res.json({
                    code: 1,
                    success: "查找成功",
                    data: result,
                });
            } else {
                res.json({
                    code: 0,
                    err: error,
                    error: "查找失败",
                });
            }
        });
});

router.post("/blogDetail", (req, res, next) => {
    let param = {
        id: req.body.id,
    };
    BlogModel.findOneAndUpdate(
        { id: param.id },
        { $inc: { blogReadings: +1, blogHot: +2 } },
        function (error, result) {
            if (error) {    
                res.json({
                    code: 0,
                    err: error,
                    error: "查找失败",
                });    
            } else {
                operate
                    .find(
                        { blogSort: result.blogSort },
                        { blogTitle: 1, id: 1 },
                        {}
                    )
                    .then((resdata, err) => {
                        if (resdata) {
                            res.json({
                                code: 1,
                                success: "查找成功",
                                data: result,
                                other: resdata,
                            });
                        } else {
                            res.json({
                                code: 0,
                                err: err,
                                error: "查找失败",
                            });
                        }
                    });
            }
        }
    );
});

router.get("/showUerBlogs", (req, res, next) => {
    userModel.findOne(
        {
            id: req.query.id,
        },
        { userCreateBlogs: 1, _id: 1 },
        function (error, result) {
            if (result) {
                const blogs = result._id;
                BlogModel.find(
                    { username: blogs },
                    {
                        blogTitle: 1,
                        id: 1,
                        blogTabs: 1,
                    },
                    {},
                    function (err, dataResult) {
                        console.log("result: ", dataResult);
                        if (dataResult) {
                            res.json({
                                code: 1,
                                success: "查找成功",
                                data: dataResult,
                            });
                        } else {
                            res.json({
                                code: 0,
                                err: err,
                                error: "查找失败",
                            });
                        }
                    }
                );
            } else {
                console.log("error: ", error);
            }
        }
    );
});

module.exports = router;
