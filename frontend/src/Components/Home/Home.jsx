import { useEffect } from "react";
import "./Home.css";
import { Typography } from "@mui/material";

import {useDispatch, useSelector} from "react-redux"
import {useAlert} from "react-alert"

import User from "../User/User";
import Post from "../Post/Post";
import Loader from "../Loader/Loader";


import { getAllUsers, getFollowingPosts } from "../../Actions/User";


const Home = () => {

  const dispatch = useDispatch();
  const alert = useAlert()
  
  useEffect(()=>{
    dispatch(getFollowingPosts())     //To load posts
    dispatch(getAllUsers())           //To load all users
  },[dispatch])

  const{loading, posts, error} = useSelector((state) => state.postOfFollowing)
  const{users, loading: usersLoading} = useSelector((state)=>state.allUsers)      //as loading name is already used

  
  const {error: likeError, message} = useSelector((state) => state.like)         //For like

  //For Like
  useEffect(()=>{
    if(error){
      alert.error(error)
      dispatch({
        type:"clearError"
      })
    }
    if(likeError){
      alert.error(likeError)
      dispatch({
        type:"clearError"
      })
    }
    if(message){
      alert.success(message)
      dispatch({
        type:"clearMessage"
      })
    }
  },[alert,error, likeError, message, dispatch])


  return loading || usersLoading ? <Loader/> : 
  <div className="home">
    <div className="homeleft">
        {posts && posts.length > 0 ? posts.map((post) => (
            <Post
                key={post._id}
                postId={post._id}
                postImage={post.image.url}
                caption={post.caption}
                likes={post.likes}
                comments={post.comments}
                ownerId={post.owner._id}
                ownerName={post.owner.name}
                ownerImage={post.owner.avatar.url}
                // isDelete={true}
                // isAccount={true}
            />
            )) : <Typography variant="h6">No posts yet</Typography>
        }
        
    </div>
    <div className="homeright">
        {users && users.length > 0 ? users.map((user) => (
        <User
            key={user._id}
            userId={user._id}
            name= {user.name}
            avatar = {user.avatar.url}
        /> ))
        :<Typography>No Users Yet</Typography> }
    </div>
   </div>
};

export default Home;