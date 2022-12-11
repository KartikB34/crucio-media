const mongoose = require("mongoose");

exports.connectDatabase = () => {
  mongoose
    // .connect(process.env.MONGO_URI)
    .connect("mongodb+srv://kingcrucio:m1Vi0TjtZmzf0xj3@cluster0.58xv8fg.mongodb.net/?retryWrites=true&w=majority")
    .then((con) => console.log(`Database Connected: ${con.connection.host}`))
    .catch((err) => console.log(err));
};