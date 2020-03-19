const mongoose = require("mongoose");
const schema = mongoose.Schema;
const personSchema = new schema({
  name: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  username: {
    type: String
  },

  gender: {
    type: String,
    require: true
  },
  phone: {
    type: String,
    require: true
  },
  profilepic: {
    contentType: String,
    data: Buffer
  },
  profilepic1: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2018/09/15/19/23/avatar-3680134_960_720.png"
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Person = mongoose.model("myPerson", personSchema);
