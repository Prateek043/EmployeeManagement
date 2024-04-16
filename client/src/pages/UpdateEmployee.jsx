import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import NavbarComponent from '../components/NavbarComponent';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useParams } from "react-router-dom";

const UpdateEmployee = () => {
  const navigate = useNavigate();
  let { id } = useParams();
  const [data, setData] = useState();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileno: '',
    designation: '',
    gender: '',
    course: ''
  });

  useEffect(() => {
    const getEmployeeDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/v1/auth/${id}`, { withCredentials: true });
        let employeeData = response.data.employee;
        setFormData({
          name: employeeData?.name,
          email: employeeData?.email,
          mobileno: employeeData?.mobileno,
          designation: employeeData?.designation,
          gender: employeeData?.gender,
          course: employeeData?.course
        });
      } catch (error) {
        console.error('Error fetching employee detail:', error);
      }
    }
    getEmployeeDetail();
  }, [id]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response=await axios.put(`http://localhost:5000/api/v1/auth/updateEmployee/${id}`,formData,{withCredentials:true});
     if(response.data.success)
     {
      alert("Employee Updated Successfully")

     }
     navigate("/list")
    } catch (error) {
      console.error('Error creating employee:', error);
    }
  };



  const [profile, setProfile] = useState();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
    }
    const user = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/v1/auth/admin", { withCredentials: true });
        if (response) {
          setProfile(response.data.admin);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    }
    user();
  }, [navigate]);

  return (
    <>
      <NavbarComponent data={profile} />
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '90vh' }}>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="formMobileNo">
            <Form.Label>Mobile No</Form.Label>
            <Form.Control type="text" name="mobileno" value={formData.mobileno} onChange={handleChange} />
          </Form.Group>
          <Form.Group controlId="formDesignation">
            <Form.Label>Designation</Form.Label>
            <Form.Control as="select" name="designation" value={formData.designation} onChange={handleChange}>
              <option value="">Select Designation</option>
              <option value="HR">HR</option>
              <option value="Manager">Manager</option>
              <option value="Sales">Sales</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formGender">
            <Form.Label>Gender</Form.Label>
            <Form.Control as="select" name="gender" value={formData.gender} onChange={handleChange}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formCourse">
            <Form.Label>Course</Form.Label>
            <Form.Control as="select" name="course" value={formData.course} onChange={handleChange}>
              <option value="">Select Course</option>
              <option value="MCA">MCA</option>
              <option value="BCA">BCA</option>
              <option value="BSC">BSC</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="formDesignation">
            <Form.Label>Image Upload</Form.Label>
            <Form.Control type="file" name="image" value={formData.image} onChange={handleChange} />
          </Form.Group>
          <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>
            Update
          </Button>
        </Form>
      </Container>
    </>
  );
};

export default UpdateEmployee;
