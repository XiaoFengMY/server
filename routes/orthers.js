const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

var formidable = require("formidable");

router.post("/upload", function (req, res, next) {
    const form = formidable({
        multiples: true,
        uploadDir: path.join(__dirname, "../public/images"),
        keepExtensions: true,
    });

    form.parse(req, function (err, fileds, files) {
        if (err) {
            console.log(err);
            res.json({
                code: 0,
                msg: "文件上传失败",
            });
        } else {
            console.log(files.logo.newFilename)
            res.json({
                code: 1,
                msg: "文件上传成功",
                imgurl: files.logo.newFilename,
                // imgurl: files.logo.filepath,
            });
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
