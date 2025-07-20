import { useState } from "react";
import type { FormEvent } from "react";
import type { Payroll } from "../pages/EmployeePayrollPage";

interface Props {
  initial?: Payroll;
  onClose: () => void;
  onSaved: () => void;
}

export default function PayrollForm({ initial, onClose, onSaved }: Props) {
  const [state, setState] = useState({
    basicSalary: initial?.basicSalary ?? 0,
    allowance: initial?.allowance ?? 0,
    transportation: initial?.transportation ?? 0,
    totalSalary: initial?.totalSalary ?? 0,
    overTimeCalc: initial?.overTimeCalc ?? 0,
    saving: false,
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const payload: Payroll = {
      employeeId: initial?.employeeId
        ? parseInt(initial.employeeId.toString())
        : 0,
      id: initial?.id,
      basicSalary: Number(state.basicSalary),
      allowance: Number(state.allowance),
      transportation: Number(state.transportation),
      totalSalary: Number(state.totalSalary),
      overTimeCalc: Number(state.overTimeCalc),
    };
    console.log("called on :" + initial?.isUpdate ? "helo" : "mello");
    console.log(payload);
    fetch(
      `/api/payroll/${initial?.isUpdate ? `update?Id=${initial.id}` : `add`}`,
      {
        method: initial?.isUpdate ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    )
      .then(() => onSaved())
      .catch((err) => {
        console.error("Failed to save payroll", err);
        onSaved();
      })
      .finally(() => {
        setState((prev) => ({
          ...prev,
          saving: false,
        }));
        onSaved();
      });
  };

  function handleState(e: any) {
    setState((prev) => ({
      ...prev,
      [e.target.name]: parseInt(e.target.value),
    }));
  }

  return (
    <div className="modal" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{initial ? "Edit Payroll" : "Add Payroll"}</h3>
        <form onSubmit={(e) => handleSubmit(e)}>
          <label>
            Basic Salary
            <input
              type="number"
              step="0.01"
              value={state.basicSalary}
              name="basicSalary"
              onChange={(e) => handleState(e)}
            />
          </label>
          <label>
            Allowance
            <input
              type="number"
              step="0.01"
              value={state.allowance}
              name="allowance"
              onChange={(e) => handleState(e)}
            />
          </label>
          <label>
            Transportation
            <input
              type="number"
              step="0.01"
              value={state.transportation}
              name="transportation"
              onChange={(e) => handleState(e)}
            />
          </label>
          <label>
            Total Salary
            <input
              type="number"
              step="0.01"
              value={state.totalSalary}
              name="totalSalary"
              onChange={(e) => handleState(e)}
            />
          </label>
          <label>
            OverTime Calc
            <input
              type="number"
              value={state.overTimeCalc}
              name="overTimeCalc"
              onChange={(e) => handleState(e)}
            />
          </label>
          <div style={{ marginTop: "0.5rem" }}>
            <button type="submit" disabled={state.saving}>
              {state.saving ? "Saving..." : "Save"}
            </button>{" "}
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
