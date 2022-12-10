import React, { useEffect, useState } from "react";
import "./UpdatePassword.css";
import { Typography, Button } from "@mui/material";

import {useDispatch, useSelector} from "react-redux"
import { updatePassword } from "../../Actions/User";
import { useAlert } from "react-alert";


const UpdatePassword = () => {

  const dispatch = useDispatch()
  const alert = useAlert()

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const {loading, message, error} = useSelector(state => state.like)


  const submitHandler = (e) => {
    e.preventDefault();                  // to stop reload the page
    dispatch(updatePassword(oldPassword,newPassword))
  };

  useEffect(()=>{
    if(error){
        alert.error(error)
        dispatch({type:"clearError"})
    }
    if(message){
        alert.success(message)
        dispatch({type:"clearMessage"})
    }
  },[alert, error, message, dispatch])


  return (
    <div className="updatePassword">
      <form className="updatePasswordForm" onSubmit={submitHandler}>
        <Typography variant="h3" style={{ padding: "2vmax" }}>
          Update password
        </Typography>

        <input
          type="password"
          placeholder="Old password"
          className="updatePasswordInputs"
          required
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="New password"
          className="updatePasswordInputs"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <Button disabled={loading} type="submit">Change password</Button>

      </form>
    </div>
  );
};

export default UpdatePassword;