const express = require("express");
const router = express.Router();
var cors = require('cors');
router.use(cors());
router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin","https://postbk.herokuapp.com"); // update to match the domain you will make the request from
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

//import schema
const Person = require("../../models/Person");
const Picture = require("../../models/Picture");

//@type - POST
//@route - /api/photo/upload
//@desc - route for upload
//@access - PRIVATE
router.post("/upload", (req, res) => {
  var text = req.body.user;
  Person.findOne({ email: text })
    .then(person => {
      if (person) {
        const picture = new Picture({
          user: person._id,
          title: req.body.title,
          name: person.username
        });
        picture.profilepic.data = req.files.profilepic.data;
        picture.profilepic.contentType = req.files.profilepic.mimetype;
        picture
          .save()
          .then(() => {
            res.json({
              message: "Successfully uploaded file ....",
              filename: `myupload/${req.files.profilepic.name}`
            });
          })
          .catch(() => {
            res.json({
              message: "error"
            });
          });
      }
    })
    .catch(err => console.log(err));
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
            res.json({ error: "error", original: picture });
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
//@type - POST
//@route - /api/photo/userphoto
//@desc - route for user photo delete
//@access - PRIVATE
router.post("/userphoto", (req, res) => {
  Person.findOne({ email: req.body.user.email })
    .then(person => {
      Picture.findOneAndDelete({ _id: req.body.id })
        .then(() => {
          return res.status(200).json({ error: "success" });
        })
        .catch(err => {
          return res.json({ error: "error" });
        });
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
