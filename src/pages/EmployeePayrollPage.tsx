import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import PayrollForm from "../components/PayrollForm";

export interface Payroll {
  id?: number | string;
  employeeId: number | string;
  date?: string;
  basicSalary: number;
  allowance: number;
  transportation: number;
  totalSalary: number;
  overTimeCalc: number;
  isUpdate?: boolean;
}

interface Employee {
  id: number | string;
  firstName: string;
  lastName: string;
}

export default function EmployeePayrollPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const state = location.state as { emp?: Employee } | undefined;
  const [employee, setEmployee] = useState<Employee | null>(state?.emp || null);
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Payroll | undefined>();
  const [filterDates, setFilterDates] = useState({ from: "", to: "" });

  const loadData = (from?: string, to?: string) => {
    if (!id) return;
    const url =
      from && to
        ? `/api/payroll/getBydate?from=${from}&to=${to}&employeeId=${id}`
        : `/api/payroll/getByEmpId?Id=${id}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => setPayrolls(data))
      .catch((err) => console.error("Failed to load payrolls", err));
  };

  const handleAdd = () => {
    if (!id) return;
    setEditing({
      employeeId: id,
      basicSalary: 0,
      allowance: 0,
      transportation: 0,
      totalSalary: 0,
      date: undefined,
      overTimeCalc: 0,
      isUpdate: false,
    });
    setShowForm(true);
  };

  const handleEdit = (p: Payroll) => {
    setEditing({ ...p, employeeId: id!, isUpdate: true });
    setShowForm(true);
  };

  const handleDelete = (payrollId: number | string) => {
    if (!confirm("Are you sure you want to delete this payroll?")) return;

    fetch(`/api/payroll/delete?id=${payrollId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Delete failed");
        loadData(filterDates.from, filterDates.to);
      })
      .catch((err) => console.error("Failed to delete payroll", err));
  };

  const handleSearch = () => {
    // if (!filterDates.from || !filterDates.to) {
    //   alert("Please provide both dates.");
    //   return;
    // }
    loadData(filterDates.from, filterDates.to);
  };

  useEffect(() => {
    if (!id) return;
    if (!employee) {
      fetch(`/api/employees/${id}`)
        .then((res) => res.json())
        .then((data) => setEmployee(data))
        .catch((err) => console.error("Failed to load employee", err));
    }
    loadData();
  }, [id, employee]);

  if (!id) {
    return null;
  }

  return (
    <div className="payroll-container">
      {employee && (
        <div className="payroll-header">
          <h2>
            {employee.firstName} {employee.lastName}
          </h2>
          <button className="button-primary" onClick={handleAdd}>
            Add Payroll
          </button>
        </div>
      )}

      <div className="filter-container">
        <input
          type="date"
          value={filterDates.from}
          onChange={(e) =>
            setFilterDates((prev) => ({ ...prev, from: e.target.value }))
          }
        />
        <input
          type="date"
          value={filterDates.to}
          onChange={(e) =>
            setFilterDates((prev) => ({ ...prev, to: e.target.value }))
          }
        />
        <button className="button-primary" onClick={handleSearch}>
          Search
        </button>
      </div>

      <table className="payroll-table">
        <thead>
          <tr>
            <th>BasicSalary</th>
            <th>Allowance</th>
            <th>Date</th>
            <th>Transportation</th>
            <th>TotalSalary</th>
            <th>OvertimeCalc</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {payrolls.map((pr) => (
            <tr key={pr.id}>
              <td>{pr.basicSalary}</td>
              <td>{pr.allowance}</td>
              <td>{pr.date?.split("T")[0]}</td>
              <td>{pr.transportation}</td>
              <td>{pr.totalSalary}</td>
              <td>{pr.overTimeCalc}</td>
              <td>
                <button
                  className="button-primary"
                  onClick={() => handleEdit(pr)}
                >
                  Edit
                </button>
              </td>
              <td>
                <button
                  className="button-danger"
                  onClick={() => handleDelete(pr.id!)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && editing && (
        <PayrollForm
          initial={editing}
          onClose={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            loadData(filterDates.from, filterDates.to);
          }}
        />
      )}
    </div>
  );
}
