const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const Like = require("../models/like");
const Dislike = require("../models/dislike");
const fs = require("fs"); //   fs.unlinkSync(path.join(__dirname, "..",user.avatar));
const path = require('path');
module.exports.signup = function (req, res) {
    if (!req.isAuthenticated()) return res.render("signup");
    else res.redirect("back");
};
module.exports.signin = function (req, res) {
    if (!req.isAuthenticated()) return res.render("signin");
    else return res.redirect("back");
};

module.exports.create = async function (req, res) {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            try {
                // User.uploadedAvatar(req, res);
                if (req.file)
                {
                    console.log(req.file);
                    await User.create({
                        email: req.body.email,
                        password: req.body.password,
                        name: req.body.name,
                        avatar: User.avatarPath + '/' + req.file.filename,
                    })
                    console.log("sign up successful");
                    return res.redirect("/user/signin");
                }
                else
                    return res.redirect("back");
                    
            } catch (err) {
                console.log("error in creating user while signing up", err);
                return;
            }
        } else {
            return res.redirect("back");
        }
    } catch (err) {
        console.log(err, "error in finding user in signing up");
        return;
    }
};

module.exports.authorize = (req, res) => {
    req.flash("success", "Logged in successfully");
    res.redirect("/home");
};

module.exports.signout = async (req, res) => {
    req.logout((err) => {
        if (err) console.log(err);
    });
    
    req.flash("success", "Logged out successfully");
    res.redirect("/");
}

module.exports.like = async (req, res) => {
    try {
        
        if (req.query.objectType == "Post")
        {
            let post = await Post.findById(req.query.objectId);
            let like = await Like.findOne({ user: req.user._id, on: req.query.objectId });
            if (like) {
                post.likesCount = post.likesCount - 1;
                await post.save();
                await Like.findByIdAndDelete(like._id);
                return res.status(200).json({
                    data: {
                        likesCount: post.likesCount
                    },
                    message: "Post unliked successfully"
                })
            }
            else {
                post.likesCount = post.likesCount + 1;
                await post.save();
                await Like.create({
                    user: req.user._id,
                    on: req.query.objectId,
                    onModel: req.query.objectType
                });
                return res.status(200).json({
                    data: {
                        likesCount: post.likesCount
                    },
                    message: "Post liked successfully"
                })
            }
        }
    } catch (err) {
        console.log("***Error during liking****", err);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

module.exports.dislike = async (req, res) => {
    try {

        if (req.query.objectType == "Post") {
            let post = await Post.findById(req.query.objectId);
            console.log(post, req.query);
            let dislike = await Dislike.findOne({ user: req.user._id, on: req.query.objectId });
            if (dislike) {
                post.dislikesCount = post.dislikesCount - 1;
                await post.save();
                await Dislike.findByIdAndDelete(dislike._id);
                return res.status(200).json({
                    data: {
                        dislikesCount: post.dislikesCount
                    },
                    message: "removed dislike successfully"
                })
            }
            else {
                post.dislikesCount = post.dislikesCount + 1;
                await post.save();
                let dl = await Dislike.create({
                    user: req.user._id,
                    on: req.query.objectId,
                    onModel: req.query.objectType
                });
                return res.status(200).json({
                    data: {
                        dislikesCount: post.dislikesCount
                    },
                    message: "Post disliked successfully"
                })
            }
        }
    } catch (err) {
        console.log("***Error during disliking****", err);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}