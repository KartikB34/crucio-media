const Post = require("../models/Post");
const User = require("../models/User")
const {sendEmail} = require("../middleware/sentEmail")
const crypto = require("crypto")
const cloudinary = require("cloudinary")

exports.register = async (req,res) => {

    try {

        const {name, email, password, avatar} = req.body;

        let user = await User.findOne({email})

        if(user){
            return res.status(400).json({
                success:false,
                message:"User with same email already exists"
            })
        }

        const mycloud = await cloudinary.v2.uploader.upload(avatar,{
            folder:"avatars"
        })

        user = await User.create({
            name,
            email, 
            password,
            avatar:{
                public_id: mycloud.public_id,
                url:mycloud.secure_url
            }
        })

        //Logging in user As soon as registered
        const token = await user.generateToken();               // YOU FORGET TO ADD AWAIT
        const options = {                                       // Creating cookie named "token" whose value is token
            expires: new Date(Date.now() + 90*24*60*60*1000),              //Expired the cookie after 9 days  
            httpOnly: true
        }

        res.status(201)                                //201 => created
            .cookie("token", token, options)           //Option contains token expiry details
            .json({
            success:true,
            user,
            token
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


//User login
exports.login = async (req,res) => {

    try {

        const {email, password} = req.body;

        let user = await User.findOne({email}).select("+password").populate("posts followers following");    //to match the password.. select should be true for password

        if(!user){
            return res.status(400).json({
                success:false,
                message:"User does not exists",
            })
        }

        const isMatch = await user.matchPassword(password);         //function is defined below User schema
        // console.log(isMatch)

        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"Incorrect password"
            })
        }

        const token = await user.generateToken();               // YOU FORGET TO ADD AWAIT
        const options = {                                       // Creating cookie named "token" whose value is token
            expires: new Date(Date.now() + 90*24*60*60*1000),              //Expired the cookie after 9 days  
            httpOnly: true
        }

        res.status(200)
            .cookie("token", token, options)
            .json({
            success:true,
            user,                                                //from here we are fetching user._id
            token
        })


    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

//user Logout
exports.logout = async (req,res) => {

    try {

        res.status(200)
            .cookie("token",null, {expires: new Date(Date.now()), httpOnly:true})
            .json({
                success:true,
                message:"Logged out"
            })

    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}



//Follow a user
exports.followUser = async (req,res) => {

    try {

        const userToFollow = await User.findById(req.params.id)
        const loggedinUser = await User.findById(req.user._id)

        if(!userToFollow){
            return res.status(404).json({
                success:true,
                message: "User not found"
            })
        }


        //if loggedInUser and userToFollow are same (You can't follow userself)   // How do we do this?
        // if(loggedinUser._id === userToFollow._id){

        //     return res.status(400).json({
        //         success:false,
        //         message:"Cannot follow yourself"
        //     })
        // }


        //if loggedInUser is already a follower of userToFollow  Then unfollow it
        if(loggedinUser.following.includes(userToFollow._id)){

            const indexFollowing = await loggedinUser.following.indexOf(userToFollow._id)
            const indexFollower = await userToFollow.followers.indexOf(loggedinUser._id)
            
            loggedinUser.following.splice(indexFollowing,1)
            userToFollow.followers.splice(indexFollower,1)

            await loggedinUser.save()
            await userToFollow.save()

            return res.status(200).json({
                success:true,
                message:"User unfollowed"
            })

        }else{        

            //add following and follower in both the users
            loggedinUser.following.push(userToFollow._id)
            userToFollow.followers.push(loggedinUser._id)

            await loggedinUser.save()
            await userToFollow.save()

            res.status(200).json({
                success:true,
                message:"User followed"
            })
        }   


        
    } catch (error) {
        
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}



//update password
exports.updatePassword = async (req,res) => {

    try {

        const user = await User.findById(req.user._id).select("+password");   //to access the password

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }

        const {oldPassword, newPassword} = req.body;
        if(!oldPassword || !newPassword){
            return res.status(404),json({
                success:false,
                message:"Please provide newPassword and oldPassword"
            })
        }

        const isMatch = await user.matchPassword(oldPassword);

        if(!isMatch){
            res.status(400).json({
                success:false,
                message:"Incorrect old password"
            })
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success:true,
            message:"Password updated"
        })
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


//update profile
exports.updateProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
  
      const { name, email, avatar } = req.body;
  
      if (name) {
        console.log(`entered name: ${name}`)
        // user.name = name;
      }
      if (email) {
        console.log(`entered email: ${email}`)
        // user.email = email;
      }
  
      if (avatar) {
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
  
        const myCloud = await cloudinary.v2.uploader.upload(avatar, {
          folder: "avatars",
        });
        user.avatar.public_id = myCloud.public_id;
        user.avatar.url = myCloud.secure_url;
      }
  
      await user.save();
  
      res.status(200).json({
        success: true,
        message: "Your profile Updated",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };


//delete my profile
exports.DeleteMyProfile = async (req,res) => {

    try {

        const user = await User.findById(req.user._id)
        const posts = user.posts                            // saving user's posts (The ids)  in an array "posts"
        const followers = user.followers                    // saving user's followers
        const following = user.following                    // saving user's followers
        const userID = user._id                             //storing for user after removing it

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }

        //removing user's avatar from cloudinary
        await cloudinary.v2.uploader.destroy(user.avatar.public_id)

        await user.remove()

        //Logout user after deleting profile
        res.cookie("token", null, {
            expires:new Date(Date.now()),
            httpOnly:true
        })

        //Delete user's posts as well
        for(let i=0; i < posts.length; i++){
            
            const post = await Post.findById(posts[i])                 //post array is an array of id
            await cloudinary.v2.uploader.destroy(post.image.public_id) //removing user's posts image from cloudinary
            await post.remove()
        }

        //removing user from follower's following
        for(let i=0; i < followers.length; i++){

            const follower = await User.findById(followers[i])
            const index = follower.following.indexOf(userID)

            follower.following.splice(index,1)
            await follower.save()
        }

        //removing user from following's follower
        for(let i=0; i < following.length; i++){

            const follows = await User.findById(following[i])
            const index = follows.followers.indexOf(userID)

            follows.followers.splice(index,1)
            await follows.save()
        }

        //removing all comments of the user from all post
        const allPosts = await Post.find();
        for(let i=0; i<allPosts.length; i++) {
            const post = await Post.findById(post[i]._id)

            for(let j=0; j<post.comments.length; j++){

                if(post.comments[j].user === userID){
                    post.comments.splice(j,1)
                }
            }
            await post.save()
        }

        //removing all likes of the user from all post
        for(let i=0; i<allPosts.length; i++) {
            const post = await Post.findById(post[i]._id)

            for(let j=0; j<post.likes.length; j++){

                if(post.likes[j] === userID){
                    post.likes.splice(j,1)
                }
            }
            await post.save()
        }

        res.status(200).json({
            success:true,
            message:"User removed"
        })
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


//My profile data
exports.myProfile = async (req,res) => {

    try {

        const user = await User.findById(req.user._id).populate("posts followers following");

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }

        res.status(200).json({
            success:true,
            user,            
        })
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


//get user profile
exports.getUserProfile = async (req,res) => {

    try {

        const user = await User.findById(req.params.id).populate("posts followers following")      //post with details to be shown

        if(!user){
            return res.status(404).json({
                success:true,
                message:"User not found"
            })
        }

        res.status(200).json({
            success:true,
            user,
        })

        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


//get all users
exports.getAllUsers = async (req,res) => {

    try {

        const users = await User.find({
            name:{$regex: req.query.name, $options:"i"}
        })

        res.status(200).json({
            success:true,
            users,
        })

        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


//forget Password
exports.forgetPassword = async (req,res) => {

    try {

        const user = await User.findOne({email: req.body.email}).select("+password");

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }

        //will generate a token that will be sent to email
        const resetPasswordToken = user.getResetPasswordToken();
        //The above function will generate reserPasswordToken and ResetPasswordExpire in database as well Thus saving the user first
        await user.save();     


        // const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetPasswordToken}`
        const resetUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetPasswordToken}`
        const message = `Dearest ${user.name}, \n Reset your password by clicking on the link below: \n\n ${resetUrl}`


        //now we'll send the mail
        try {
            await sendEmail({
                email:user.email, 
                subject:"Reset password link", 
                message
            })            
        } catch (error) {

            //as E-mail was not able to sent so..
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save()

            return res.status(500).json({
                success:false,
                message:error.message
            })
        }

        res.status(200).json({
            success:true,
            message:`email sent to ${user.email}`
        })
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


//reset pasword after receiving mail
exports.resetPassword = async (req,res) => {

    try {

        const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")

        const user = await User.findOne({
            resetPasswordToken: resetPasswordToken,
            resetPasswordExpire: {$gt: Date.now()}            //should be greater than current time
        })

        // console.log(req.password)
        // console.log(user)
        // console.log(req.params.token)

        if(!user){
            return res.status(404).json({
                success:false,
                message:"Token is invalid or has expired"
            })
        }

        user.password = req.body.password;

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({
            success:true,
            message:"Password successfully reset"
        })

        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


//Get my posts
exports.getMyPosts = async (req,res) => {

    try {

        const posts = await Post.find({owner:req.user._id}).populate("likes comments.user owner")

        if(!posts){
            res.status(404).json({
                success:false,
                message:"No post found"
            })
        }

        // const user = await User.findById(req.user._id);

        // const posts = [];

        // for (let i = 0; i < user.posts.length; i++) {
        //     const post = await Post.findById(user.posts[i]).populate(
        //     "likes comments.user owner"
        // );
        // posts.push(post);
        // }

        res.status(200).json({
            success: true,
            posts,
        });

    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}


//Get user posts
exports.getUserPosts = async (req,res) => {

    try {

        const posts = await Post.find({owner:req.params.id}).populate("likes comments.user owner")

        if(!posts){
            res.status(404).json({
                success:false,
                message:"No post found"
            })
        }

        // const user = await User.findById(req.user._id);

        // const posts = [];

        // for (let i = 0; i < user.posts.length; i++) {
        //     const post = await Post.findById(user.posts[i]).populate(
        //     "likes comments.user owner"
        // );
        // posts.push(post);
        // }

        res.status(200).json({
            success: true,
            posts,
        });

    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}