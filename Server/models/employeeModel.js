const {mongoose, Schema} =require ("mongoose");
const jwt=require('jsonwebtoken')
//schema
const userSchema = new mongoose.Schema(
  {
    name:{
      type: String,
      required: [true, " Name is Required!"],
    },
    email: {
      type: String,
      required: [true, " Email is Required!"],
      unique: true,
    },
    mobileno:{
        type:Number,
        required:true,
    },
    designation:{
        type:String,
        required:true,
    },
    gender:{
        type:String,
        required:true,
    },
    course:{
        type:String,
        required:true,
    },
    image: { type: String },
    accountType:{
      type:String,
      default:'User'
    }
  },
  { timestamps: true }
);

const Users = mongoose.model("Users", userSchema);

module.exports=Users;
