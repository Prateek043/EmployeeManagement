import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';

function NavbarComponent(profile) {
  const navigate=useNavigate();
  const handleLogout=async()=>{
    const response=await axios.get("http://localhost:5000/api/v1/auth/logout",{withCredentials:true});
    if(response.data.success===201)
    {
      localStorage.clear();
    }
  navigate("/login")
  }

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/home">Employee Management</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/home">Home</Nav.Link>
            <Nav.Link href="/list">Employee-List</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link href="#deets">{profile?.data?.username}</Nav.Link>
            <button onClick={handleLogout}>
              Logout
            </button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;