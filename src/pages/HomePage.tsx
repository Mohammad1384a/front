import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Employee {
  id: number | string;
  firstName: string;
  lastName: string;
}

export default function HomePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  const loadEmployees = () => {
    fetch(`/api/Employee/GetAll`)
      .then((res) => res.json())
      .then(setEmployees)
      .catch((err) => console.error("Failed to load employees", err));
  };

  const handleAddEmployee = () => {
    setLoading(true);
    fetch(`/api/employee/addEmployee`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to add employee");
        return;
      })
      .then(() => {
        setShowForm(false);
        setFirstName("");
        setLastName("");
        loadEmployees();
      })
      .catch((err) => console.log(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  return (
    <div className="container">
      <h1>Employees</h1>
      <button className="button-primary" onClick={() => setShowForm(true)}>
        Add Employee
      </button>

      {showForm && (
        <div className="modal" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Add Employee</h3>
            <input
              type="text"
              value={firstName}
              placeholder="FirstName"
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="LastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <div style={{ marginTop: "1rem" }}>
              <button
                disabled={loading}
                className="button-primary"
                onClick={() => handleAddEmployee()}
              >
                Add
              </button>{" "}
              <button onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>
                {emp.firstName} {emp.lastName}
              </td>
              <td>
                <Link to={`/employees/${emp.id}`} state={{ emp }}>
                  View Payrolls
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
