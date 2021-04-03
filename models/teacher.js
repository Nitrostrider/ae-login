//sup mongoose here
const mongoose = require("mongoose")
const teacherSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String },
  email: { type: String },
  //green probably not necessary, use _id instead
  //id: String,
  password: { type: String },
  __v: false,
})

module.exports = mongoose.model("Teacher", teacherSchema)

