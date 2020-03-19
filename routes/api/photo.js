const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jsonwt = require("jsonwebtoken");
const key = require("../../setup/myurl");
const multer = require("multer");
const path = require("path");
var fs = require("fs");

//import schema
const Person = require("../../models/Person");
const Picture = require("../../models/Picture");

// multer...
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./routes/public/myupload");
  },
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});
var upload = multer({ storage: storage }).single("profilepic");

//@type - POST
//@route - /api/photo/upload
//@desc - route for upload
//@access - PRIVATE
router.post("/upload", (req, res) => {
  var user = {};
  upload(req, res, error => {
    user = JSON.parse(req.body.user);
    Person.findOne({ email: user.email })
      .then(person => {
        if (person) {
          const picture = new Picture({
            user: user._id,
            title: req.body.title,
            name: user.username
          });

          picture.profilepic.data = fs.readFileSync(
            `./routes/public/myupload/${req.file.filename}`
          );
          picture.profilepic.contentType = `image/${path
            .extname(req.file.originalname)
            .replace(".", "")}`;
          picture.save();
          fs.unlinkSync(`./routes/public/myupload/${req.file.filename}`);
          if (error) {
            res.json({
              message: "error"
            });
          } else {
            res.json({
              message: "Successfully uploaded file ....",
              filename: `myupload/${req.file.filename}`
            });
          }
        }
      })
      .catch(err => console.log(err));
  });
});
//@type - POST
//@route - /api/photo/post
//@desc - route for upload
//@access - PRIVATE
router.post("/post", (req, res) => {
  Person.findOne({ email: req.body.email })
    .then(person => {
      Picture.find()
        .then(picture => {
          const array = {
            picture: [],
            error: "success",
            original: picture
          };
          const len = picture.length;
          for (let i = 0; i < len; i++) {
            if (picture[i].user.toString() === req.body._id.toString()) {
              array.picture.unshift(picture[i]);
            }
          }
          if (array.picture.length === 0) {
            res.json({ error: "error" });
          } else {
            res.json(array);
          }
        })
        .catch(err => console.log(err));
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
