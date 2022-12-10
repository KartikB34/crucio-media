import React from 'react'
import { useState } from 'react'
import "./Search.css"

import { Button, Typography } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../../Actions/User';
import User from '../User/User';

const Search = () => {

  const [name, setName] = useState("")

  const dispatch = useDispatch()

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(getAllUsers(name))
  }

  const {users, loading} = useSelector(state => state.allUsers)

  return (
    <div className="search">
      <form className="searchForm" onSubmit={submitHandler}>
        <Typography variant="h3" style={{ padding: "2vmax" }}>
          Search any user
        </Typography>

        <input
          type="text"
          value={name}
          placeholder="Name"
          required
          onChange={(e) => setName(e.target.value)}
        />

        <Button disabled={loading} type="submit">
          Search
        </Button>
        
        <div className="searchResults">
          {users && users.map((user) => (
            <User
              key={user._id}
              userId={user._id}
              name={user.name}
              avatar={user.avatar.url}
            />
          ))}
        </div>

      </form>

    </div>
  )
}

export default Search