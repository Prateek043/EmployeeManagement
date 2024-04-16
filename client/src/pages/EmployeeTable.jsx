import React, { useState, useEffect } from 'react';
import { Table, Button } from 'react-bootstrap';
import NavbarComponent from '../components/NavbarComponent';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [profile, setProfile] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Change this to adjust items per page
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    const response = await axios.get("http://localhost:5000/api/v1/auth/", { withCredentials: true });
    setEmployees(response.data.data);
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
    }
    const fetchProfile = async () => {
      const response = await axios.get("http://localhost:5000/api/v1/auth/admin", { withCredentials: true });
      if (response) {
        setProfile(response.data.admin);
      }
    };
    fetchProfile();
  }, [navigate]);

  useEffect(() => {
    fetchEmployees();
  }, []);

  //Delete Employee 
  const handleDelete = async (id) => {
    const response = await axios.delete(`http://localhost:5000/api/v1/auth/deleteEmployee/${id}`, { withCredentials: true });
    if (response.data.success) {
      alert("Deleted Successfully");
      fetchEmployees();
    }
  };

  // Pagination Logic
  const indexOfLastEmployee = currentPage * itemsPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage;
  const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <NavbarComponent data={profile} />
      <div className="container d-flex justify-content-end mt-3 mb-3 gap-10">
        <p className='text-black' style={{ marginRight: "10px", marginTop: "7px" }}>Total Employee: {employees.length}</p>
        <input type="search" name="search" id="search" style={{ marginRight: '10px' }} placeholder="Search by name or email" />
        <Button variant="primary">Search</Button>
      </div>
      <div className="container d-flex justify-content-center">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Unique Id</th>
              <th>Image</th>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile No</th>
              <th>Designation</th>
              <th>Gender</th>
              <th>Course</th>
              <th>Create Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentEmployees.map((employee, index) => (
              <tr key={employee._id}>
                <td>{indexOfFirstEmployee + index + 1}</td>
                <td><img src={employee.image} alt="Employee" width="50" height="50" /></td>
                <td>{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.mobileno}</td>
                <td>{employee.designation}</td>
                <td>{employee.gender}</td>
                <td>{employee.course}</td>
                <td>{new Date(employee.createdAt).toLocaleDateString('en-US', {
                  day: '2-digit',
                  month: 'short',
                  year: '2-digit'
                })}</td>
                <td>
                  <Button variant="primary" style={{ marginRight: '5px' }}>
                    <Link to={`/update/${employee._id}`} style={{ color: "white", textDecoration: "none" }}>Edit</Link>
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(employee._id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <div className="container d-flex justify-content-center">
      <ul className="pagination">
          {Array.from({ length: Math.ceil(employees.length / itemsPerPage) }, (_, i) => (
            <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
              <Button onClick={() => paginate(i + 1)} className="page-link">
                {i + 1}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default EmployeeTable;
