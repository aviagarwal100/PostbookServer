const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyparser = require("body-parser");
const db = require("./setup/myurl").mongodbURL;
const port = process.env.PORT || 5000;
const app = express();
const auth = require("./routes/api/auth");
const photo = require("./routes/api/photo");

mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("mongobd connected successfully...");
  })
  .catch(err => {
    console.log(err);
  });

// passport middleware
app.use(passport.initialize());
// passport-jwt configuration...
require("./Strategies/passport")(passport);



// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin","*"); // update to match the domain you will make the request from
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept,Authorization"
//   );
//   next();
// });
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
// route for testing ...
app.get("/", (req, res) => {
  res.send("Hey bigStack");
});
// actual route ...
app.use("/api/auth", auth);
app.use("/api/photo", photo);

app.listen(port,
  function () {
    var port = server.address().port;
    console.log("Express is working on port " + port);
  
});
