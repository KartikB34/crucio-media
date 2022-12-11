import axios from "axios"


//To Login User
export const LoginUser = (email, password) => async (dispatch) => {

    try {

        dispatch({
            type:"LoginRequest"
        })

        //data will contain: success:true, user and token
        const {data} = await axios.post("/api/v1/login", {email,password}, {
            headers:{
                "Content-Type":"application/json"
            }
        })

        dispatch({
            type:"LoginSuccess",
            payload:data.user,
        })
        
    } catch (error) {
        dispatch({
            type:"LoginFailure",
            payload:error.response.data.message
        })
    }
}


//Register User
export const registerUser = (name,email,password, avatar) => async (dispatch) => {

    try {

        dispatch({
            type:"RegisterRequest"
        })

        const {data} = await axios.post("/api/v1/register",{
            name,
            email,
            password,
            avatar
        },{
            headers:{
                "Content-Type":"application/json"
            }
        })

        dispatch({
            type:"RegisterSuccess",
            payload:data.user
        })
        
    } catch (error) {
        dispatch({
            type:"RegisterFailure",
            payload:error.response.data.message
        })
    }
}


//Update user profile
export const updateProfile = (name,email,avatar) => async (dispatch) => {

    try {

        dispatch({
            type:"updateProfileRequest",
        })

        // console.log(name)
        // console.log(email)

        const {data} = await axios.put("/api/v1/update/profile", {
            name,
            email,
            avatar
        },{
            headers:{
                "Content-Type":"application/json"
            }
        })

        dispatch({
            type:"updateProfileSuccess",
            payload:data.message
        })
        
    } catch (error) {
        dispatch({
            type:"updateProfileFailure",
            payload:error.response.data.message
        })
    }
}


//Update password
export const updatePassword = (oldPassword, newPassword) => async (dispatch) =>{

    try {

        dispatch({
            type:"updatePasswordRequest",
        })

        const {data} = await axios.put("/api/v1/update/password",{
            oldPassword,
            newPassword
        },{
            headers:{
                "Content-Type":"application/json"
            }
        })

        dispatch({
            type:"updatePasswordSuccess",
            payload:data.message
        })
        
    } catch (error) {
        dispatch({
            type:"updatePasswordFailure",
            payload: error.response.data.message
        })
    }
}

//delete my profile
export const deleteMyProfile = () => async (dispatch) => {

    try {

        dispatch({
            type:"deleteProfileRequest"
        })

        const {data} = await axios.delete("/api/v1/delete/me")

        dispatch({
            type:"deleteProfileSuccess",
            payload:data.message
        })
        
    } catch (error) {
        dispatch({
            type:"deleteProfileFailure",
            payload:error.response.data.message
        })
    }
}


//forgot password
export const ForgotPassword = (email) => async (dispatch) => {

    try {

        dispatch({
            type:"forgotPasswordRequest"
        })

        const {data} = await axios.post("/api/v1/forgot/password",{
            email,
        },{
            headers:{
                "Content-Type":"application/json"
            }
        })

        dispatch({
            type:"forgotPasswordSuccess",
            payload:data.message,
        })
        
    } catch (error) {
        dispatch({
            type:"forgotPasswordFailure",
            payload:error.response.data.message
        })
    }
} 

//reset password request
export const resetPassword = (token, password) => async (dispatch) => {

    try {

        dispatch({
            type:"resetPasswordRequest"
        })

        const {data} = await axios.put(`/api/v1/password/reset/${token}`, {
            password,
        },{
            headers:{
                "Content-Type":"application/json"
            }
        })

        dispatch({
            type:"resetPasswordSuccess",
            payload:data.message
        })
        
    } catch (error) {
        dispatch({
            type:"resetPasswordFailure",
            payload:error.response.data.message
        })
    }
}


//User Logout
export const LogoutUser = () => async (dispatch) => {

    try {

        dispatch({
            type:"LogoutRequest",
        })

        const {data} = await axios.get("/api/v1/logout")

        dispatch({
            type:"LogoutSuccess",
            payload: data.message
        })
        
    } catch (error) {
        dispatch({
            type:"LogoutFailure",
            payload:error.response.data.message
        })
    }
}


//If user is already loggedIn
export const loadUser = () => async (dispatch) => {

    try {
        
        dispatch({
            type:"LoadUserRequest"
        })

        const {data} = await axios.get("/api/v1/me");

        dispatch({
            type:"LoadUserSuccess",
            payload:data.user,
        })
    } catch (error) {

        dispatch({
            type:"LoadUserFailure",
            payload:error.response.data.message,
        })
        
    }
}


//To get all posts of following
export const getFollowingPosts = () => async (dispatch) =>{

    try {

        dispatch({
            type:"postOfFollowingRequest"
        })

        const {data} = await axios.get("/api/v1/posts")

        dispatch({
            type:"postOfFollowingSuccess",
            payload: data.posts                                    //Refer backend whenever necessary
        })
        
    } catch (error) {

        dispatch({
            type:"postOfFollowingError",
            payload:error.response.data.message
        })
        
    }
}


//Get all users && (((name is empty by default so all users are loaded if no name is given)))
export const getAllUsers = (name = "") => async (dispatch) =>{ 

    try {

        dispatch({
            type:"allUserRequest",
        })

        const {data} = await axios.get(`/api/v1/users?name=${name}`)

        dispatch({
            type:"allUserSuccess",
            payload:data.users,
        })

        
    } catch (error) {
        dispatch({
            type:"allUserFailure",
            payload: error.response.data.message
        })
    }
}


//get my posts
export const getMyPosts = () => async (dispatch) => {

    try {

        dispatch({
            type:"myPostRequest"
        })

        const {data} = await axios.get("/api/v1/my/posts")

        dispatch({
            type:"myPostSuccess",
            payload:data.posts
        })
        
    } catch (error) {
        dispatch({
            type:"myPostFailure",
            payload: error.response.data.message
        })
    }
}


//get user posts
export const getUserPosts = (id) => async (dispatch) => {

    try {

        dispatch({
            type:"userPostRequest"
        })

        const {data} = await axios.get(`/api/v1/userposts/${id}`)

        dispatch({
            type:"userPostSuccess",
            payload:data.posts
        })
        
    } catch (error) {
        dispatch({
            type:"userPostFailure",
            payload: error.response.data.message
        })
    }
}


//get user Profile
export const getUserProfile = (id) => async (dispatch) => {

    try {

        dispatch({
            type:"userProfileRequest"
        })

        const {data} = await axios.get(`/api/v1/user/${id}`)

        dispatch({
            type:"userProfileSuccess",
            payload:data.user
        })
        
    } catch (error) {
        dispatch({
            type:"userProfileFailure",
            payload: error.response.data.message
        })
    }
}


//Follow user request
export const followAndUnfollowUser = (id) => async (dispatch) => {

    try {

        dispatch({
            type:"followUserRequest"
        })

        const {data} = await axios.get(`/api/v1/follow/${id}`)

        dispatch({
            type:"followUserSuccess",
            payload:data.message
        })
        
    } catch (error) {
        dispatch({
            type:"followUserFailure",
            payload: error.response.data.message
        })
    }
}