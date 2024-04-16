const Admin =require ("../models/adminModel.js");
const Employee=require("../models/employeeModel.js")
const { compareString, createJWT, hashString } =require ("../utils/index.js");
const uploadOnCloudinary=require("../utils/cloudinary.js")

exports.register = async (req, res, next) => {
  const { username, password } = req.body;

  //validate fileds
  if (!( username || password)) {
    return res.status(401).json({
        success:false,
        message:"Provide all the fields"
    })
  }

  try {
    const adminExist = await Admin.findOne({ username });

    if (adminExist) {
        return res.status(401).json({
            success:false,
            message:"Username Address already exists"
        })
    }

    const hashedPassword = await hashString(password);

    const admin = await Admin.create({
      username,
      password: hashedPassword,
    });
    return res.status(200).json({
      success:true,
      message:"Admin registered Successfully"
    })
   
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    //validation
    if (!username || !password) {
        return res.status(401).json({
            success:false,
            message:"Provide all the fields"
        })
    }

    // find user by email
    const admin = await Admin.findOne({ username });

    if (!admin) {
        return res.status(401).json({
            success:false,
            message:"Invalid Username and Password"
        })
    }

    // compare password
    const isMatch = await compareString(password, admin?.password);

    if (!isMatch) {
        return res.status(401).json({
            success:false,
            message:"Invalid Username and Password"
        })
    }
    const token = createJWT(admin?._id);
    admin.token=token;
    await admin.save();
    admin.password = undefined;
    const options = {
      path:'/',
      expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      httpOnly: true,
        secure: true,
        sameSite: 'None'
    }
    return res
    .status(201)
    .cookie('adminAccessToken',token,options,{maxAge:86400000})
    .json({
      success: true,
      message: "Login successfully",
      admin,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

exports.logout=async(req,res)=>{
  try{
    await Admin.findByIdAndUpdate(
      req.admin.userId,
      {
          $unset: {
              token: ""
          }
      },
      {
          new: true
      }
  )
  const options = {
    path:'/',
    httpOnly: true,
      secure: true,
      sameSite: 'None'
  }
  return res
  .status(201)
  .clearCookie("adminAccessToken",options)
  .json({
    success:true,
    data:{},
    message:"Admin logged Out Successfully"
  })
   }catch(error)
   {
    return res.status(500).json({
      success:false,
      error:error,
      message:"Internal Server Error"
    })
   }
}
//Get Admin 

exports.getAdminData=async(req,res)=>{
  const adminId=req.admin.userId;
  const admin=await Admin.findById({_id:adminId})
  return res.status(201).json({
    success:true,
    admin
  })
}



//Register Employee
exports.createEmployee=async(req,res)=>{
  try{
    const {name,email,mobileno,designation,gender,course}=req.body;
    if(!name || !email || !mobileno || !designation || !gender || !course)
    {
      return res.status(401).json({
        success:false,
        message:"Enter all the Fields"
      })
    }
    const existingEmployee=await Employee.findOne({email});
    if(existingEmployee){
      return res.status(401).json({
        success:false,
        message:"Employee Existed"
      })
    }
    const employee=await Employee.create({
      name,email,mobileno,designation,gender,course
    })
    if(req.files){
      const avatarLocalPath = req.files?.image[0]?.path;
      if (avatarLocalPath) {
        const avatar = await uploadOnCloudinary(avatarLocalPath);
        if (!avatar) {
          return res.status(401).json({
            success:false,
            message:"Avatar file is required"
          })
        }
        employee.image = avatar.url;
      }
    }
    await employee.save()
    return res.status(201).json({
      success:true,
      message:"Employee Created Successfully"
    })
  }catch(error)
  {
   return res.status(500).json({
     success:false,
     error:error,
     message:"Internal Server Error"
   })
  }
}

//Update An Employee
exports.updateEmployee=async(req,res)=>{
  try {
    const employeeId = req.params.id;
    const updatedProfileData = req.body;
    const updatedEmployee = await Employee.findByIdAndUpdate(
        {_id:employeeId} ,
        updatedProfileData,
        { new: true }
    );
    if(req.files){
      const avatarLocalPath = req.files?.image[0]?.path;
      if (avatarLocalPath) {
        const avatar = await uploadOnCloudinary(avatarLocalPath);
        console.log(avatar);
        if (!avatar) {
          return res.status(401).json({
            success:false,
            message:"Avatar file is required"
          })
        }
        updatedEmployee.image = avatar.url;
      }
    }
    await updatedEmployee.save();
    if(!updatedEmployee){
        return res.status(404).json({
            success:false,
            message:"Error while uploading Image"
        })
    }
    return res.status(201).json({
        success:true,
        data:updatedEmployee
    });
  }catch(error)
  {
   return res.status(500).json({
     success:false,
     error:error,
     message:"Internal Server Error"
   })
  }
}

//Delete A Employee
exports.deleteEmployee=async(req,res)=>{
  try{
    const empId=req.params.id;
    await Employee.findByIdAndDelete(empId);

    res.status(201).json({
      success: true,
      message: "Employee Deleted successfully",
    });
  }catch(error)
  {
   return res.status(500).json({
     success:false,
     error:error,
     message:"Internal Server Error"
   })
  }
}

//Get All Employee
exports.getAllEmployee=async(req,res)=>{
  try{
    const employee=await Employee.find();
    if(employee.length>0)
    {
      return res.status(201).json({
        success:true,
        totalEmployee:employee.length,
        data:employee
      })
    }else{
      return res.status(201).json({
        success:true,
        message:"No employee Existed",
        totalEmployee:employee.length,
        data:[]
      })
    }
  }catch(error)
  {
   return res.status(500).json({
     success:false,
     error:error,
     message:"Internal Server Error"
   })
  }
}

//getA Single Employee

exports.getSingleUser=async(req,res)=>{
  try{
    const empid=req.params.id;
    const employee=await Employee.findById({_id:empid})
    return res.status(201).json({
      success:true,
      employee
    })
  }catch(error)
  {
   return res.status(500).json({
     success:false,
     error:error,
     message:"Internal Server Error"
   })
  }
}