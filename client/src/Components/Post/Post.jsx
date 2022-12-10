import { Avatar, Button, Typography, Dialog } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import "./Post.css"

import {
    MoreVert,
    Favorite,
    FavoriteBorder,
    ChatBubbleOutline,
    DeleteOutline,
  } from "@mui/icons-material";

import {useDispatch, useSelector} from "react-redux"
import { addCommentOnPost, deletePost, likePost, updatePost } from '../../Actions/Post';
import { getFollowingPosts, getMyPosts, getUserPosts, loadUser } from '../../Actions/User';
import User from '../User/User';
import CommentCard from '../CommentCard/CommentCard';

//isDelete and isAccount for user's post
const Post = ({postId, caption, postImage, likes=[], comments=[], ownerImage, ownerName, ownerId, isDelete = false, isAccount = false, page=""}) => {

    const [liked, setLiked] = useState(false)
    const [likesUser, setLikesUser] = useState(false)

    const [commentValue, setCommentValue] = useState("")
    const [commentToggle, setCommentToggle] = useState(false)

    const [captionValue, setCaptionValue] = useState(caption)
    const [captionToggle, setCaptionToggle] = useState(false)

    const dispatch = useDispatch()

    const handleLike =  async () =>{
        setLiked(!liked)
        await dispatch(likePost(postId))

        // if my account then show only my posts (for profile section)
        if(isAccount){   
          dispatch(getMyPosts())
        }else{
          dispatch(getFollowingPosts())      //To update the post data after adding comment or like
        }
        if(page==="profile"){
          dispatch(getUserPosts(ownerId))
        }
        // alert.success("Post Liked!")
    }

    //Comment handler
    const addCommentHandler = async (e) => {
      e.preventDefault()
      await dispatch(addCommentOnPost(postId, commentValue))

      if(isAccount){   
        dispatch(getMyPosts())
      }else{
        dispatch(getFollowingPosts())      //To update the post data after adding comment or like
      }
      if(page==="profile"){
        dispatch(getUserPosts(ownerId))
      }
    }

    //update Caption handler
    const updateCaptionHandler = (e) => {
      e.preventDefault()
      dispatch(updatePost(captionValue, postId))
      dispatch(getMyPosts())
    }

    //Delete post handler
    const deletePostHandler = async (e) => {
      e.preventDefault()
      await dispatch(deletePost(postId))
      dispatch(getMyPosts())
      dispatch(loadUser())
    }

    const {user} = useSelector((state) => state.user)

    //Should be under useEffect
    useEffect(()=>{
      likes.forEach((item) => {
        if(item._id === user._id){                 //as Likes array is populated in backend
          setLiked(true)
        }
      })
    },[likes, user])


  return (
    <div className='post'>
      <div className='postHeader'>

        {isAccount? <Button>
            <MoreVert onClick={()=>{setCaptionToggle(!captionToggle)}} />
        </Button> : null}

      </div>



      <img src={postImage} alt="Post" />

      <div className="postDetails">
        <Avatar src={ownerImage} alt="User" sx={{
            height:"3vmax",
            width:"3vmax",
        }} />

        <Link to={`/user/${ownerId}`} fontWeight={700}><Typography>{ownerName}</Typography></Link>

        <Typography
          fontWeight={100}
          color="rgba(0, 0, 0, 0.582)"
          style={{ alignSelf: "center" }}
        >
            {caption}
        </Typography>
       </div>

        <button
            style={{
                border: "none",
                backgroundColor: "white",
                cursor: "pointer",
                margin: "1vmax 2vmax",
              }}
            onClick = {()=>{setLikesUser(!likesUser)}}
            disabled = {likes.length === 0}
        >
            <Typography>{likes.length} Likes</Typography>
        </button>

        <div className="postFooter">

            <Button onClick={handleLike}>
            {liked ? <Favorite style={{ color: "red" }} /> : <FavoriteBorder />}
            </Button>

            <Button onClick={()=>setCommentToggle(!commentToggle)}>
                <ChatBubbleOutline />
            </Button>

            {isDelete ? (
                <Button>
                    <DeleteOutline  onClick={deletePostHandler}/>
                </Button>
            ) : null}

        </div>

        {/* Dialogue box to show liked users */}
        <Dialog 
          open={likesUser} 
          onClose={()=>setLikesUser(!likesUser)}
        >
          <div className='DialogBox'>
            <Typography variant="h4">Liked by:</Typography>

            {likes.map((user) => (
              <User
                key={user._id}
                userId={user._id}
                name= {user.name}
                avatar = {user.avatar.url}
              />
            ))}

          </div>
        </Dialog>

        {/* Dialogue box to show user comments */}
        <Dialog 
          open={commentToggle} 
          onClose={()=>setCommentToggle(!commentToggle)}
        >
          <div className='DialogBox'>
            <Typography variant="h4">Comments:</Typography>
            <form action="" className="commentForm" onSubmit={addCommentHandler}>
              <input 
              type="text" 
              value={commentValue} 
              onChange={(e)=>setCommentValue(e.target.value)} 
              placeholder="Comment here.."
              required
            />

            <Button type="submit" variant="contained">Add</Button>
            </form>

            {comments.length > 0 ? comments.map((comment) => (
              <CommentCard 
                key={comment._id}
                commentId = {comment._id}
                comment = {comment.comment}
                name= {comment.user.name}
                avatar= {comment.user.avatar.url}
                userId={comment.user._id}
                postId={postId}
                isAccount={isAccount}
                page={page}
              />
            )) : <Typography>No comments yet</Typography>}
          </div>
        </Dialog>


        {/* Dialogue box to update caption */}
        <Dialog 
          open={captionToggle} 
          onClose={()=>setCaptionToggle(!captionToggle)}
        >
          <div className='DialogBox'>
            <Typography variant="h4">Update caption:</Typography>
            <form action="" className="commentForm" onSubmit={updateCaptionHandler}>
              <input 
              type="text" 
              value={captionValue} 
              onChange={(e)=>setCaptionValue(e.target.value)} 
              placeholder="Caption here.."
              required
            />

            <Button type="submit" variant="contained">Update</Button>
            </form>
          </div>
        </Dialog>

    </div>
  )
}

export default Post
