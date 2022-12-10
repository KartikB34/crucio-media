import {configureStore} from "@reduxjs/toolkit"
import { allUserReducer, postOfFollowingReducer, useReducer, userProfileReducer } from "./Reducers/User";
import { likeReducer, myPostReducer, userPostReducer } from "./Reducers/Post";

// const initialState={}

const store = configureStore({
    reducer:{
        user:useReducer,
        postOfFollowing: postOfFollowingReducer,
        allUsers: allUserReducer,
        like: likeReducer,
        myPosts: myPostReducer,
        userProfile: userProfileReducer,
        userPosts: userPostReducer,
    }
});

export default store;