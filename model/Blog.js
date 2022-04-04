// 引入mongodb
const db = require("../db/mongodb");
const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
// 建立用户表
const BlogSchema = new mongoose.Schema({
    // 用户类型 0：博主 1：其他用户
    username: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    blogTitle: { 
        type: String, 
        default: "" 
    },
    blogSort: {
        type: String,
        default: ""
    },
    blogTabs: [{
        type: String,
        default: ""
    }],
    blogRecommend: {
        type: String,
        default: "叶一帆，前端及后端开发，计信院最肥的鸽子"
    },
    blogContent: {
        type: String,
        default: "",
    },
    image: {
        type: String,
        default: "",
    },
    createTime: {
        type: Date,
        default: Date.now,
    },
    updateTime: {
        type: Date,
        default: Date.now,
    },
    blogSee: {
        type: Boolean,
        default: true
    },
    blogLikes: {
        type: Number,
        default: 0,
    },
    blogCollects:{
        type: Number,
        default: 0,
    },
    blogReadings:{
        type: Number,
        default: 0,
    },
    blogHot:{
        type: Number,
        default: 0,
    },
    blogComments: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }
});
autoIncrement.initialize(mongoose.connection); 
BlogSchema.plugin(autoIncrement.plugin, {
    model: "Blog",
    field: "id",
    startAt: 1,
    incrementBy: 1,
});

const BlogModel = db.model("Blog", BlogSchema);
module.exports = BlogModel;
