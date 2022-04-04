var express = require("express");
var router = express.Router();
let BlogModel = require('../model/Blog.js');

router.get("/hotBlogList", (req, res, next) => {
    BlogModel
        .find(
            {},
            {
                blogTitle: 1,
                id: 1,
                username: 1,
                blogTabs: 1,
                blogLikes: 1,
                blogCollects: 1,
                blogRecommend: 1,
            },
            { sort: { blogHot: -1 }, limit: 10 },
            function(err, doc){ 
                if(err) {
                    console.log(err.message)
                }else{
                    res.json({
                        data: doc,
                    })
                }
            }
        ).populate('username','username _id id useravatar ');
        
});

module.exports = router;
