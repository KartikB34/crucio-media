const Post = require("../models/Post");
const User = require("../models/User");
const cloudinary = require("cloudinary");

exports.createPost = async (req,res) => {

    try{

        const mycloud = await cloudinary.v2.uploader.upload(req.body.image, {
            folder:"posts"
        })     //Uploading image to cloudinary in folder named "posts"

        const newPostData = {
            caption: req.body.caption,
            image:{
                public_id:mycloud.public_id,
                url:mycloud.secure_url
            },
            owner:req.user._id,
        }


        const post = await Post.create(newPostData);

        const user = await User.findById(req.user._id)

        user.posts.unshift(post._id)              //unshift me starting me add hoga
        await user.save();                      //Save bhi krna pdta hai

        res.status(201).json({
            success:true,
            post,
            message:"Post Created"
        });

    } catch(err){
        res.status(500).json({
            success:false,
            message:err.message,
        })
    }
}

//Delete Post
exports.deletePost = async (req,res) => {

    try {

        const post = await Post.findById(req.params.id)

        if(!post){
            return res.status(404).json({
                success:false,
                message:"Post not found"
            })
        }

        //Only the owner of post can delete the post
        if(post.owner.toString() !== req.user._id.toString()){
            
            return res.status(401).json({
                success:false,
                message:"Unautharised user"
            })
        }

        //if the user is the owner
        await post.remove()

        //Removing the image from cloudinary
        await cloudinary.v2.uploader.destroy(post.image.public_id)

        
        //Removing post._id from User.posts
        const user = await User.findById(req.user._id)
        const index = user.posts.indexOf(req.params.id)

        user.posts.splice(index,1)
        await user.save()                  //we'll save the user not user.posts


        res.status(200).json({
            success:true,
            message:"Post deleted"
        })

        

    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}



//Like and dislike the post
exports.LikeAndUnlikePost = async (req,res) => {

    try {
        const post = await Post.findById(req.params.id)      // here param is "id" not "_id" (check routes of post)

        //if no such post
        if(!post){
            return res.status(404).json({
                success:false,
                message:"Post not found"
            })
        }

        //If already liked by this user the dislike it
        if(post.likes.includes(req.user._id)){
            const index = post.likes.indexOf(req.user._id)              //AWAIT use krna chahiye ki nhi??

            post.likes.splice(index,1)                                  //It's splice not slice removing from index, how many to remove
            await post.save();

            return res.status(200).json({
                success:true,
                message:"Post unliked"
            })
        }else{
            //if not liked by user then Like it!
            post.likes.push(req.user._id)
            await post.save()

            return res.status(200).json({
                success:true,
                message: "Post liked"
            })
        }
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message: error.message
        })
    }
}


exports.getPostOfFollowing = async (req,res) => {

    try {

        //insted of showing user._id in following
        //populate will show all the details of that(all) user in following
        //adding "posts will filter details on "posts" only and ignore remaining details

        // const user = await User.findById(req.user._id).populate("following", "posts")
        
        //OR
        const user = await User.findById(req.user._id)

        //$in operator selects the documents where the value of a field equals any value in the specified array
        const posts = await Post.find({                //finding post by owner
            owner:{
                $in: user.following,                   //inserting id's of following users as owner of post
            },
        }).populate("owner likes comments.user")       //Actual post me dikhana padega naa

        res.status(200).json({
            success:true,
            posts:posts.reverse(),             //Latest post should be displayed first
        })
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


//Update caption
exports.updateCaption = async (req,res) => {

    try {
        
        const post = await Post.findById(req.params.id)

        if(!post){
            return res.status(404).json({
                success:false,
                message:"Post not found"
            })
        }

        if(post.owner.toString() !== req.user._id.toString()){
            return res.status(404).json({
                success:false,
                message: "unauthorised user"
            })
        }

        const {caption} = req.body;

        if(caption){
            post.caption = caption;
            // post.caption = req.body.caption;
        }

        await post.save()

        res.status(200).json({
            success:true,
            message:"Post updated"
        })



    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


//add or update comment
exports.commentOnPost = async (req,res) => {

    try {

        const post = await Post.findById(req.params.id)

        if(!post){
            return res.status(404).json({
                success:true,
                message:"Post not found"
            })
        }

        if(!req.body.comment){
            return res.status(404).json({
                success:true,
                message:"Comment is empty"
            })
        }

        //checking if user's comment already exists
        let commentIndex = -1
        post.comments.forEach((comment,index) => {
            
            if(comment.user.toString() === req.user._id.toString()){
                commentIndex = index;                                //not "-1" & returning index as well
            }
        });

        if(commentIndex !== -1){
            post.comments[commentIndex].comment=req.body.comment;
            await post.save()

            res.status(200).json({
                success:true,
                message:"Comment Updated"
            })

        }else{
            post.comments.push({
                user:req.user._id,
                comment:req.body.comment
            })
            res.status(200).json({
                success:true,
                message:"Comment added"
            })
        }

        await post.save()

        
    } catch (error) {
        res.status(500).json({
            status: true,
            message:error.message
        })
    }
}


//delete a comment
exports.deleteComment = async (req,res) => {

    try {

        const post = await Post.findById(req.params.id)

        if(!post){
            return res.status(404).json({
                success:false,
                message:"Post not found"
            })
        }

        //if you are the owner of the post you can delete any comment
        //if you are not the owner of the post you can only delete your comment;

        if(post.owner.toString() === req.user._id.toString()){

            if(req.body.commentId == undefined){
                return res.status(404).json({
                    success:true,
                    message: "Comment ID is required"
                })
            }
            // console.log("outside for each")

            post.comments.forEach((comment,index) => {
                
                // we will pass comment ID through body
                // console.log("inside for each")
                if(comment._id.toString() === req.body.commentId.toString()){

                    //extra ka loop kyu run krwana?
                    return post.comments.splice(index,1);
                }
            });

            await post.save()
            res.status(200).json({
                success:true,
                message:"Selected comment deleted"
            })

        }else{

            post.comments.forEach((comment,index) => {

                if(comment.user.toString() === req.user._id.toString()){

                    //extra ka loop kyu run krwana?
                    return post.comments.splice(index,1);
                }

            });

            await post.save();
            res.status(200).json({
                success:true,
                message:"Your comment has been deleted"
            })
        }
        
    } catch (error) {
        res.status(500).json({
            success:true,
            message:error.message
        })
    }
}