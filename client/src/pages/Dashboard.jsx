import React, { useEffect, useState } from 'react';
import NavbarComponent from '../components/NavbarComponent';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState();

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            navigate("/login")
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
            <div className="container text-center">
                <h1>Welcome To Admin Dashboard</h1>
                <Link to="/create" className="btn btn-primary mt-3">Create Employee</Link>
            </div>
        </>
    );
}
