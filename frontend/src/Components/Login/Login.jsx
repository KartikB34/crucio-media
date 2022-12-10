import React, { useEffect, useState } from "react";
import "./Login.css";
import { Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

import {useDispatch, useSelector} from "react-redux"
import { LoginUser } from "../../Actions/User";
import { useAlert } from "react-alert";



const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch()
  const alert = useAlert()

  const {error} = useSelector(state => state.user)


  const loginHandler = (e) => {
    e.preventDefault();                  // to stop reload the page
    dispatch(LoginUser(email,password))
  };

  useEffect(()=>{
    if(error){
      alert.error(error)
      dispatch({type:"clearErrors"})
    }
  }, [dispatch, error, alert])


  return (
    <div className="login">
      <form className="loginForm" onSubmit={loginHandler}>
        <Typography variant="h3" style={{ padding: "2vmax" }}>
          Crucio Media
        </Typography>

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Link to="/forgot/password">
          <Typography>Forgot Password?</Typography>
        </Link>

        <Button type="submit">Login</Button>

        <Link to="/register">
          <Typography>New User?</Typography>
        </Link>
      </form>
    </div>
  );
};

export default Login;