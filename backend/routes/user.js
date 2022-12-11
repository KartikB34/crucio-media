const express=require("express");
const { register, login, followUser, logout, updatePassword, getUserPosts, updateProfile, DeleteMyProfile, myProfile, getUserProfile, getAllUsers, forgetPassword, resetPassword, getMyPosts } = require("../controller/user");
const { isAuthenticated } = require("../middleware/auth");
const router = express.Router()

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/follow/:id").get(isAuthenticated,followUser)
router.route("/update/password").put(isAuthenticated, updatePassword)
router.route("/update/profile").put(isAuthenticated, updateProfile)
router.route("/delete/me").delete(isAuthenticated, DeleteMyProfile)
router.route("/me").get(isAuthenticated, myProfile)
router.route("/user/:id").get(isAuthenticated, getUserProfile)
router.route("/users").get(isAuthenticated, getAllUsers)
router.route("/forgot/password").post(forgetPassword)
router.route("/password/reset/:token").put(resetPassword)
router.route("/my/posts").get(isAuthenticated, getMyPosts)
router.route("/userposts/:id").get(isAuthenticated, getUserPosts)

module.exports = router;