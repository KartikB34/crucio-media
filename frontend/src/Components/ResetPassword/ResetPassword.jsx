import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import "./ResetPassword.css"

import { Typography, Button } from '@mui/material'
import { useAlert } from 'react-alert'
import { resetPassword } from '../../Actions/User'
import { Link, useParams } from 'react-router-dom'

const ResetPassword = () => {

    const [newPassword, setNewPassword] = useState()

    const dispatch = useDispatch()
    const alert = useAlert()
    const params = useParams()
    // console.log(params)

    const {error, message, loading} = useSelector(state => state.like)

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(resetPassword(params.token, newPassword))                  //specified in App.js
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
    },[error, message, dispatch, alert])

  return (
    <div className="resetPassword">
      <form className="resetPasswordForm" onSubmit={submitHandler}>
        <Typography variant="h3" style={{ padding: "2vmax" }}>
          Reset your password
        </Typography>

        <input
          type="password"
          placeholder="New password"
          className="resetPasswordInputs"
          required
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <Link to="/">Login</Link>
        <Typography>OR</Typography>
        <Link to="/forgot/password">Request another token</Link>

        <Button disabled={loading} type="submit">Reset password</Button>


      </form>
    </div>
  )
}

export default ResetPassword