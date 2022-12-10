import './App.css';
import { useEffect } from 'react';
import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
import Header from './Components/Header/Header';
import Login from './Components/Login/Login';
import {useDispatch, useSelector} from "react-redux"

import { loadUser } from './Actions/User';

import Home from "./Components/Home/Home"
import Account from "./Components/Account/Account"
import NewPost from './Components/Newpost/Newpost';
import Register from './Components/Register/Register';
import UpdateProfile from './Components/UpdateProfile/UpdateProfile';
import UpdatePassword from './Components/UpdatePassword/UpdatePassword';
import ForgetPassword from './Components/ForgetPassword/ForgetPassword';
import ResetPassword from './Components/ResetPassword/ResetPassword';
import UserProfile from './Components/UserProfile/UserProfile';
import Search from './Components/Search/Search';
import NotFound from './Components/NotFound/NotFound';

function App() {

  const dispatch = useDispatch();

  useEffect( ()=>{
    dispatch(loadUser())
  },[dispatch])

  //store "user" contains isAuthenticated data
  const {isAuthenticated} = useSelector((state) => state.user)

  return (
    <Router>
      {isAuthenticated && <Header/>}
      <Routes>
        <Route path="/" element={isAuthenticated? <Home/> :<Login/>} />
        <Route path="/account" element={isAuthenticated? <Account/> :<Login/>} />
        <Route path="/newpost" element={isAuthenticated? <NewPost/> :<Login/>} />
        <Route path="/register" element={isAuthenticated? <Account/> :<Register/>} />
        <Route path="/update/profile" element={isAuthenticated? <UpdateProfile/> :<Register/>} />
        <Route path="/update/password" element={isAuthenticated? <UpdatePassword/> :<Register/>} />
        <Route path="/forgot/password" element={isAuthenticated? <UpdatePassword/> :<ForgetPassword/>} />
        <Route path="/password/reset/:token" element={isAuthenticated? <UpdatePassword/> :<ResetPassword/>} />
        <Route path="/user/:id" element={isAuthenticated? <UserProfile/> :<Login/>} />
        <Route path="/search" element={isAuthenticated? <Search/> :<Login/>} />
        <Route path="*" element={<NotFound/>} />
      </Routes>
    </Router>
  );
}

export default App;
