import React, { useState } from "react"
import "./loginStyle.css"
import axios from 'axios'
import { useNavigate } from "react-router-dom"
export default function (props) {
  const navigate=useNavigate();
  const [data,setData]=useState({
    username:"",
    password:"",
  })

  const handleChange=(e)=>{
    const name=e.target.name;
    const value=e.target.value
    setData({...data,[name]:value})
  }
    const handleSubmit=async(e)=>{
      e.preventDefault();
      const user=await axios.post("http://localhost:5000/api/v1/auth/login",data,{withCredentials:true})
      console.log(user)
      localStorage.setItem("authToken",user.data.token);
      alert(user.data.message)
      navigate("/home")
    }
  return (

    <div className="Auth-form-container">
      <form className="Auth-form">
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign In</h3>
          <div className="form-group mt-3">
            <label>Username</label>
            <input
              type="email"
              className="form-control mt-1"
              placeholder="Enter Username"
              name="username"
              value={data.username}
              onChange={handleChange}
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Enter password"
              name="password"
              value={data.password}
              onChange={handleChange}
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}