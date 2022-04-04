// 引入mongodb
const db = require("../db/mongodb");
const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
// 建立评论表
const CommentSchema = new mongoose.Schema({
    commentAuthor: {
        type: String,
        default: "",
    },
    commeContent: {
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
                default: '0'
            },
        },
    ],
    hots: {
        type: Number,
        default: 0,
    },
    createTime: {
        type: Date,
        default: Date.now,
    },
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
            commentUser: {
                type: String,
                default: "",
            },
            commentUserId: {
                type: Number,
                default: 0,
            },
            like_user: [
                {
                    like_user_id: {
                        type: Number,
                        default: '0'
                    },
                },
            ],s

        },
    ],
});
autoIncrement.initialize(mongoose.connection);
CommentSchema.plugin(autoIncrement.plugin, {
    model: "Blog",
    field: "id",
    startAt: 1,
    incrementBy: 1,
});

const CommentModel = db.model("Blog", CommentSchema);
module.exports = CommentModel;
