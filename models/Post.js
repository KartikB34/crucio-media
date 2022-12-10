const mongoose = require("mongoose")

const postSchema = mongoose.Schema({

    caption:String,
    image:{
        public_id:String,
        url:String
    },

    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    createdAt:{
        type:Date,
        default:Date.now
    },

    
    likes:[                 //Likes should be array of users naa..
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    comments:[{                                  //Array of (comment and the user's ID)
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        comment:{
            type:String,
            required:true
        }
    }]
})

module.exports = mongoose.model("Post",postSchema)