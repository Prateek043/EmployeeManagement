const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Admin=require("../models/adminModel")
dotenv.config();

exports.userAuth = async (req, res, next) => {
  const token =
    req.cookies?.adminAccessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized request",
    });
  } else {
    try {
      const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.admin = decoded;
      next();
    } catch (err) {
      console.log("Invalid Token", err);
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }
  }
};

exports.isAdmin = async (req, res, next) => {
	try {
		const userDetails = await Admin.findOne({ _id:req.admin.userId });

		if (userDetails.accountType !== "Admin") {
			return res.status(401).json({
				success: false,
				message: "This is a Protected Route for Admin",
			});
		}
		next();
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, message: `User Role Can't be Verified` });
	}
};
