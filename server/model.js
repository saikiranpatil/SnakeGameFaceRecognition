const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter your name"],
        unique: [true, "user Already Exists"]
    },
    imageUrl: {
        type: String,
        required: [true, "URL not provided"],
    },
    scores: [{
        score: {
            type: Number,
            required: [true, "score not provided"],
        },
        at: {
            type: Date,
            default: Date.now()
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("User", userSchema);