const express = require("express")
const path = require("path")
const app=express()
var cookieParser = require("cookie-parser")

if(process.env.NODE_ENV !== "Production"){
    require("dotenv").config({path:"config/config.env"});
}

//Using middlewares
app.use(express.json({limit:"50mb"}));
app.use(express.urlencoded({limit:"50mb",extended:true}));
app.use(cookieParser())


//Importing router
const post = require("./routes/post")
const user = require("./routes/user");


//Using routes
app.use("/api/v1",post)
app.use("/api/v1",user)


//doing at last
// app.use(express.static(path.join(__dirname, "./frontend/build")));

// app.get("*", (req,res) => {
//     res.sendFile(path.join(__dirname, "./frontend/build/index.html"))
// })
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});


module.exports = app;