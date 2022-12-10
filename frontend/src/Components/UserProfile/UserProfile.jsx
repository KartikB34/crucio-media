import { Avatar, Button, Dialog, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { followAndUnfollowUser, getUserPosts, getUserProfile } from "../../Actions/User";
import Loader from "../Loader/Loader";
import Post from "../Post/Post";
import User from "../User/User";
// import "./Account.css";              //CSS already present for this

const UserProfile = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const params = useParams()

  const { user: me} = useSelector((state) => state.user);
  const { user, loading: userLoading, error:userError } = useSelector((state) => state.userProfile);
  const { loading, error, posts } = useSelector((state) => state.userPosts);
  const {
    error: followError,
    message,
    loading: followLoading
  } = useSelector((state) => state.like);

  const [followersToggle, setFollowersToggle] = useState(false);
  const [followingToggle, setFollowingToggle] = useState(false);
  const [following, setFollowing] = useState(false);
  const [myProfile, setMyProfile] = useState();

  const followHandler = async (e) => {
    e.preventDefault()
    await dispatch(followAndUnfollowUser(user._id))
    await dispatch(getUserProfile(params.id))
    setFollowing(!following)
  }

  useEffect(() => {
    dispatch(getUserPosts(params.id));
    dispatch(getUserProfile(params.id));
    }, [dispatch, params.id]);

  useEffect(()=>{

    if(me._id === params.id){
      setMyProfile(true);
  }

  if(user){
    user.followers.forEach(item => {
      if(item._id === me._id){
        setFollowing(true)
      }else{
        setFollowing(false)
      }
    })
  }

  },[params.id, me._id, user])

  useEffect(() => {

    if (error) {
      alert.error(error);
      dispatch({ type: "clearErrors" });
    }

    if (followError) {
      alert.error(followError);
      dispatch({ type: "clearError" });
    }

    if (userError) {
      alert.error(userError);
      dispatch({ type: "clearError" });
    }

    if (message) {
      alert.success(message);
      dispatch({ type: "clearMessage" });
    }

    // dispatch() //posts

    if(user){
      user.followers.forEach((item) => {
        if(item._id === me._id){
          setFollowing(true)
        }
      })
    }

  }, [alert, error, message, followError, userError, user, me._id, dispatch]);

  return userLoading|| loading ? <Loader/> : <div className="account">

    <div className="accountleft">      
      {posts && posts.length > 0 ? (
          posts.map((post) => (
            <Post
              key={post._id}
              postId={post._id}
              caption={post.caption}
              postImage={post.image.url}
              likes={post.likes}
              comments={post.comments}
              ownerImage={post.owner.avatar.url}
              ownerName={post.owner.name}
              ownerId={post.owner._id}
              isAccount={false}
              isDelete={false}
              page="profile"
            />
          ))
        ) : (
          <Typography variant="h6">User has not made any post</Typography>
        )}
    </div>

    <div className="accountright">
      { user && (<>                                    {/*Because initiallu user does not loads*/}
        <Avatar
        src={user.avatar.url}
        sx={{ height: "8vmax", width: "8vmax" }}
      />

      <Typography variant="h5">{user.name}</Typography>

      <div>
        <button onClick={() => setFollowersToggle(!followersToggle)}>
          <Typography>Followers</Typography>
        </button>
        <Typography>{user.followers.length}</Typography>
      </div>

      <div>
          <button onClick={() => setFollowingToggle(!followingToggle)}>
            <Typography>Following</Typography>
          </button>
          <Typography>{user.following.length}</Typography>
      </div>

      <div>
          <Typography>Posts</Typography>
          <Typography>{user.posts.length}</Typography>
      </div>

      {!myProfile && <Button
         variant="contained" 
         style={{background:following? "red" : ""}}
         disabled={followLoading}
         onClick={followHandler}
        >
          {following? "Unfollow" : "Follow"}
      </Button>}
      </>)}

      <Dialog
        open={followersToggle}
        onClose={()=>setFollowersToggle(!followersToggle)}
      >
        <div className="DialogBox">
          <Typography varient="h4">Followers</Typography>
            {user && user.followers.length > 0 ? (
              user.followers.map((follower) => (
                <User
                    key={follower._id}
                    userId={follower._id}
                    name={follower.name}
                    avatar={follower.avatar.url}
                  />
              ))
            ):<Typography style={{margin:"2vxmax"}}> You have no followers</Typography>}
        </div>
      </Dialog>


      <Dialog
        open={followingToggle}
        onClose={()=>setFollowingToggle(!followingToggle)}
      >
        <div className="DialogBox">
          <Typography varient="h4">Following</Typography>
            {user && user.following.length > 0 ? (
              user.following.map((following) => (
                <User
                    key={following._id}
                    userId={following._id}
                    name={following.name}
                    avatar={following.avatar.url}
                  />
              ))
            ):<Typography style={{margin:"2vxmax"}}> You follows no one</Typography>}
        </div>
      </Dialog>
      
    </div>
    

    </div>
};

export default UserProfile;