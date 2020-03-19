const mongoose = require("mongoose");
const schema = mongoose.Schema;
const pictureSchema = new schema({
  user: {
    type: schema.Types.ObjectId,
    ref: "myPerson"
  },
  profilepic: {
    contentType: String,
    data: Buffer
  },
  title: {
    type: String,
    require: true
  },
  name: {
    type: String,
    require: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Picture = mongoose.model("myPicture", pictureSchema);
