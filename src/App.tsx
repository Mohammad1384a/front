import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import EmployeePayrollPage from "./pages/EmployeePayrollPage";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/employees/:id" element={<EmployeePayrollPage />} />
      </Routes>
    </BrowserRouter>
  );
}
