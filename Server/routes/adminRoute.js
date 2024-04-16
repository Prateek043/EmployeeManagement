const express=require('express');
const AdminController=require("../controllers/adminController")
const {userAuth,isAdmin}=require("../middlewares/authMiddleware")
const {upload}=require("../middlewares/multerMiddleware")
const router=express.Router();

//Route to create Admin
router.post("/register",AdminController.register)
//Route to login a Admin
router.post("/login",AdminController.login)
//Route to logout Admin
router.get("/logout",userAuth,isAdmin,AdminController.logout)
//Get Admin Data
router.get("/admin",userAuth,isAdmin,AdminController.getAdminData)
//Create employee 
router.post("/createEmployee",userAuth,isAdmin,upload.fields([
    {
        name: "image",
        maxCount: 1
    }
]),AdminController.createEmployee)

//update Employee
router.put("/updateEmployee/:id",userAuth,isAdmin,upload.fields([
    {
        name: "image",
        maxCount: 1
    }
]),AdminController.updateEmployee);

//Delete an Employee

router.delete("/deleteEmployee/:id",userAuth,isAdmin,AdminController.deleteEmployee)

//Get All Employee

router.get("/",userAuth,isAdmin,AdminController.getAllEmployee)

//get Single USer
router.get("/:id",userAuth,isAdmin,AdminController.getSingleUser)

module.exports=router;