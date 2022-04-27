// 引入mongodb
const db = require("../db/mongodb");
const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
// 建立评论表
const CommentSchema = new mongoose.Schema({
    blogId: {
        type: Number,
        required: true,
    },
    username: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    commentContent: {
        type: String,
        default: "",
    },
    // 是否置顶
    is_top: {
        type: Boolean,
        default: false,
    },
    like_user: [
        {
            like_user_id: {
                type: Number,
                default: "0",
            },
        },
    ],
    //热度
    hots: {
        type: Number,
        default: 0,
    },
    createTime: {
        type: Date,
        default: Date.now,
    },
    //子评论
    children: [
        {
            commentTime: {
                type: Date,
                default: Date.now,
            },
            commentContent: {
                type: String,
                default: "",
            },
            username: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
            like_user: [
                {
                    like_user_id: {
                        type: Number,
                        default: "0",
                    },
                },
            ],
        },
    ],
});

autoIncrement.initialize(mongoose.connection); 
CommentSchema.plugin(autoIncrement.plugin, {
    model: "Comment",
    field: "id",
    startAt: 1,
    incrementBy: 1,
});

const CommentModel = db.model("Comment", CommentSchema);
module.exports = CommentModel;
