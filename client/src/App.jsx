import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import CreateEmployee from "./pages/CreateEmployee"
import EmployeeTable from "./pages/EmployeeTable"
import UpdateEmployee from "./pages/UpdateEmployee"

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/create" element={<CreateEmployee />} />
        <Route path="/update/:id" element={<UpdateEmployee/>} />
        <Route path="/list" element={<EmployeeTable/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App