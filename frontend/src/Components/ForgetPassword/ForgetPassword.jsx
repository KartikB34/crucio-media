import React, { useEffect, useState } from "react";
import "./ForgetPassword.css";

import { Typography, Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { ForgotPassword } from "../../Actions/User";

const ForgetPassword = () => {

    const [email,setEmail] = useState("")

    const dispatch = useDispatch()
    const alert = useAlert()

    const {error, message, loading} = useSelector(state=>state.like)

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(ForgotPassword(email))
    }

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
    <div className="forgotPassword">
      <form className="forgotPasswordForm" onSubmit={submitHandler}>
        <Typography variant="h3" style={{ padding: "2vmax" }}>
          Enter your email
        </Typography>

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          className="forgotPasswordInputs"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* sends resent link with token */}
        <Button disabled={loading} type="submit">Send reset link</Button>

      </form>
    </div>
  );
};

export default ForgetPassword;