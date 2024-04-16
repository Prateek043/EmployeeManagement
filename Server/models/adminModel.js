const {mongoose, Schema} =require ("mongoose");

//schema
const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, " Username is Required!"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is Required!"],
      minlength: [6, "Password length should be greater than 6 character"],
      select: true,
    },
    token:{
      type:String
    },
    accountType:{
      type:String,
      default:'Admin'
    }
  },
  { timestamps: true }
);


const Admin = mongoose.model("Admin", adminSchema);

module.exports=Admin;
