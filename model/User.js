// 引入mongodb
const db = require("../db/mongodb");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
// 建立用户表
const UserSchema = new mongoose.Schema({
    // 用户类型 0：管理员 1：其他用户
    type: {
        type: Number,
        default: 1,
    },
    // 个人介绍
    introduce: { 
        type: String, 
        default: "" 
    },
    useravatar: {
        type: String,
        default: "efc80212e8bab0d05de823a00.jpg",
        select: true,
    },
    //用户协议
    agreement: {
        type: Boolean,
        default: false
    },
    email: {
        type: String,
        default: ""
    },
    phone: {
        type: Number,
        default: "",
    },
    sex: {
        type: String,
        default: "other",
        enum: ["male", "femal", "other"]
    },
    birthday:{
        type: Date,
        default: ""
    },
    username: {
        type: String,
        //唯一索引
        unique: true, 
        default: "",
        select: true,
    },
    password: {
        type: String,
        set(val) {
             // 参数1：要散列的值；参数2：指数，，可以理解为一个密码的强度，指数越大越影响效率
            return bcrypt.hashSync(val, 10);
        },
        default: "",
    },
    rePassword: {
        type: String,
        set(val) {
            return bcrypt.hashSync(val, 10);
        },
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
    userFans: [{
        type: Number,
        default: ""
    }],
    userFocus: [{
        type: Number,
        default: ""
    }],
    userPrestige: {
        type: Number,
        default: 0
    },
    //用户点赞的文章
    userLikeBlogs: [{
        type: String,
    }],
});
autoIncrement.initialize(mongoose.connection); 
UserSchema.plugin(autoIncrement.plugin, {
    model: "User",
    field: "id",
    startAt: 1,
    incrementBy: 1,
});

const userModel = db.model("User", UserSchema);
module.exports = userModel;
