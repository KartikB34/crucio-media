import { Button, Typography } from "@mui/material";
import React, { useState } from "react";
import "./Newpost.css";
import {useSelector, useDispatch} from "react-redux"
import { createNewPost } from "../../Actions/Post";
import { useEffect } from "react";
import { useAlert} from "react-alert"
import { loadUser } from "../../Actions/User";

const NewPost = () => {

    const dispatch = useDispatch()
    const alert = useAlert()

    const{loading, error, message} = useSelector((state) => state.like)

    const [image, setImage] = useState(null)
    const [caption, setCaption] = useState("")

    const handleImageChange = (e) => {
        const file = e.target.files[0]

        const Reader = new FileReader();
        Reader.readAsDataURL(file)

        //readyState = 0 => initialState
        //readyState = 1 => processing
        //readyState = 2 => Processed
        Reader.onload = () => {
            if(Reader.readyState === 2) {
                setImage(Reader.result);
            }
        }
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        await dispatch(createNewPost(caption, image))
        dispatch(loadUser())
        setCaption("")
        setImage(null)
    }

    useEffect(()=>{
        if(error){
            alert.error(error);
            dispatch({
                type:"clearError"
            })
        }
        if(message){
            alert.success(message);
            dispatch({
                type:"clearMessage"
            })
        }
    }, [alert, error, message, dispatch])

  return (
    <div className="newPost">
      <form className="newPostForm" onSubmit={submitHandler}>
        <Typography variant="h3">New Post</Typography>

        {/*If image is uploaded by the user then show it*/}
        {image && <img src={image} alt="post" />}
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <input
          type="text"
          placeholder="Caption..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        {/* If loading then disable the button else */}
        <Button disabled={loading} type="submit">
          Post
        </Button>
      </form>
    </div>
  );
};

export default NewPost;