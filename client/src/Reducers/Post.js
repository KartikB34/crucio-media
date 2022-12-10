import {createReducer} from "@reduxjs/toolkit"

const initialState={}

//Reducer for both likes and comment
export const likeReducer = createReducer(initialState,{

    //For likes
    likeRequest: (state)=>{
        state.loading = true;
    },

    likeSuccess: (state, action) => {
        state.loading = false;
        state.message = action.payload;
    },

    likeFailure: (state,action) => {
        state.loading = false;
        state.error = action.payload;
    },

    //For adding comments
    addCommentRequest: (state)=>{
        state.loading = true;
    },

    addCommentSuccess: (state, action) => {
        state.loading = false;
        state.message = action.payload;
    },

    addCommentFailure: (state,action) => {
        state.loading = false;
        state.error = action.payload;
    },

    //For deleting comments
    deleteCommentRequest: (state)=>{
        state.loading = true;
    },

    deleteCommentSuccess: (state, action) => {
        state.loading = false;
        state.message = action.payload;
    },

    deleteCommentFailure: (state,action) => {
        state.loading = false;
        state.error = action.payload;
    },


    //For uploading new post
    newPostRequest: (state)=>{
        state.loading = true;
    },

    newPostSuccess: (state, action) => {
        state.loading = false;
        state.message = action.payload;
    },

    newPostFailure: (state,action) => {
        state.loading = false;
        state.error = action.payload;
    },


    //For updating caption
    updateCaptionRequest: (state)=>{
        state.loading = true;
    },

    updateCaptionSuccess: (state, action) => {
        state.loading = false;
        state.message = action.payload;
    },

    updateCaptionFailure: (state,action) => {
        state.loading = false;
        state.error = action.payload;
    },

    //For following user
    followUserRequest: (state)=>{
        state.loading = true;
    },

    followUserSuccess: (state, action) => {
        state.loading = false;
        state.message = action.payload;
    },

    followUserFailure: (state,action) => {
        state.loading = false;
        state.error = action.payload;
    },


    //For deleting  a post
    deletePostRequest: (state)=>{
        state.loading = true;
    },

    deletePostSuccess: (state, action) => {
        state.loading = false;
        state.message = action.payload;
    },

    deletePostFailure: (state,action) => {
        state.loading = false;
        state.error = action.payload;
    },


    //For Updating Profile
    updateProfileRequest: (state) => {
        state.loading = true;
    },
    updateProfileSuccess: (state, action) => {
        state.loading = false;
        state.message = action.payload;
    },
    updateProfileFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },

    //For forget pasword
    forgotPasswordRequest: (state) => {
        state.loading = true;
    },
    forgotPasswordSuccess: (state, action) => {
        state.loading = false;
        state.message = action.payload;
    },
    forgotPasswordFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },


    //For reset pasword
    resetPasswordRequest: (state) => {
        state.loading = true;
    },
    resetPasswordSuccess: (state, action) => {
        state.loading = false;
        state.message = action.payload;
    },
    resetPasswordFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },


    //For Updating Password
    updatePasswordRequest: (state) => {
        state.loading = true;
    },
    updatePasswordSuccess: (state, action) => {
        state.loading = false;
        state.message = action.payload;
    },
    updatePasswordFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },


    //For deleting Profile
    deleteProfileRequest: (state) => {
        state.loading = true;
    },
    deleteProfileSuccess: (state, action) => {
        state.loading = false;
        state.message = action.payload;
    },
    deleteProfileFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },

    clearError: (state) => {
        state.error = null;
    },

    clearMessage: (state) => {
        state.message = null;
    }
}) 


//My posts Reducer
export const myPostReducer = createReducer(initialState,{

    myPostRequest:(state)=>{
        state.loading = true
    },

    myPostSuccess:(state,action) =>{
        state.loading=false
        state.posts= action.payload
    },

    myPostFailure:(state,action) =>{
        state.loading=false
        state.error=action.error
    },

    clearError:(state)=>{
        state.error = null
    },

})


//User posts Reducer
export const userPostReducer = createReducer(initialState,{

    userPostRequest:(state)=>{
        state.loading = true
    },

    userPostSuccess:(state,action) =>{
        state.loading=false
        state.posts= action.payload
    },

    userPostFailure:(state,action) =>{
        state.loading=false
        state.error=action.error
    },

    clearError:(state)=>{
        state.error = null
    },

})