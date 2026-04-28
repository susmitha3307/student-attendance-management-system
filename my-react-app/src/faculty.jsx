import React, { useEffect, useState } from "react";
import "./faculty.css";

export default function Faculty() {

  const [page, setPage] = useState("home");
  const [refresh, setRefresh] = useState(0);

  const [dept, setDept] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const [viewDept, setViewDept] = useState("");

  const [markDept, setMarkDept] = useState("");
  const [markDate, setMarkDate] = useState("");

  const [viewAttDept, setViewAttDept] = useState("");
  const [period, setPeriod] = useState("");

  const [attendanceState, setAttendanceState] = useState({});

  useEffect(() => {
    updateAttendanceState();
  }, []);

  // ---------------- LOAD STUDENTS ----------------
  function getStudents() {
    return JSON.parse(localStorage.getItem("student")) || [];
  }

  // ---------------- CREATE ----------------
  function createAccount() {
    let students = getStudents();

    if (!name || !email || !pwd || !dept) {
      alert("Please fill all fields");
      return;
    }

    if (students.some(u => u.email === email)) {
      alert("Email already exists!");
      return;
    }

    students.push({ name, email, password: pwd, dept });
    localStorage.setItem("student", JSON.stringify(students));

    alert("Account Created");

    setName("");
    setEmail("");
    setPwd("");
    setDept("");

    setRefresh(r => r + 1);
  }

  // ---------------- DELETE ----------------
  function deleteAcc(email) {
    let students = getStudents();
    students = students.filter(u => u.email !== email);
    localStorage.setItem("student", JSON.stringify(students));
    setRefresh(r => r + 1);
  }

  // ---------------- DASHBOARD ----------------
  function getCount() {
    return getStudents().length;
  }

  // ---------------- LOAD STUDENTS TABLE ----------------
  function getFilteredStudents() {
    let students = getStudents();

    if (viewDept && viewDept !== "all") {
      students = students.filter(u => u.dept === viewDept);
    }

    return students;
  }

  // ---------------- ATTENDANCE SAVE ----------------
  function saveAttendance() {
    if (!markDept || !markDate) {
      alert("Select dept and date");
      return;
    }

    let checkboxes = document.querySelectorAll("input[data-roll]");
    let attendance = JSON.parse(localStorage.getItem("attendance")) || {};

    if (!attendance[markDept]) attendance[markDept] = {};
    attendance[markDept][markDate] = {};

    checkboxes.forEach(cb => {
      attendance[markDept][markDate][cb.dataset.roll] =
        cb.checked ? "Present" : "Absent";
    });

    localStorage.setItem("attendance", JSON.stringify(attendance));
    alert("Attendance Saved");

    updateAttendanceState();
  }

  function updateAttendanceState() {
    let attendance = JSON.parse(localStorage.getItem("attendance")) || {};
    setAttendanceState(attendance);
  }

  // ---------------- VIEW ATTENDANCE ----------------
  function getAttendanceReport() {
    if (!viewAttDept || !period) return [];

    let students = getStudents().filter(s => s.dept === viewAttDept);
    let attendance = attendanceState[viewAttDept] || {};
    let today = new Date();

    return students.map(s => {
      let roll = s.email.split("@")[0];
      let total = 0;
      let present = 0;

      Object.entries(attendance).forEach(([date, day]) => {
        let d = new Date(date);
        let include = true;

        if (period === "weekly") {
          let last7 = new Date();
          last7.setDate(today.getDate() - 7);
          include = d >= last7 && d <= today;
        }

        if (period === "monthly") {
          include =
            d.getMonth() === today.getMonth() &&
            d.getFullYear() === today.getFullYear();
        }

        if (include && day[roll]) {
          total++;
          if (day[roll] === "Present") present++;
        }
      });

      let percent = total ? Math.round((present / total) * 100) : 0;

      return { roll, name: s.name, percent };
    });
  }

  const students = getFilteredStudents();
  const report = getAttendanceReport();
function downloadAttendance() {
  if (!report || report.length === 0) {
    alert("No data to download");
    return;
  }

  let csv = "S.No,Roll,Name,Percentage\n";

  report.forEach((r, i) => {
    csv += `${i + 1},${r.roll},${r.name},${r.percent}%\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `attendance_${viewAttDept}_${period}.csv`;
  a.click();

  window.URL.revokeObjectURL(url);
}
  return (
    <div id="dashboard">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>FACULTY SPACE</h2>
        <ul>
          <li onClick={() => setPage("home")}>Dashboard</li>
          <li onClick={() => setPage("create")}>Create Accounts</li>
          <li onClick={() => setPage("view")}>View Accounts</li>
          <li onClick={() => setPage("mark")}>Mark Attendance</li>
          <li onClick={() => setPage("views")}>View Attendance</li>
          <li onClick={() => {
            localStorage.removeItem("currentUser");
            window.location.reload();
          }}>Logout</li>
        </ul>
      </div>

      <div className="content">

        {/* HOME */}
        {page === "home" && (
          <div className="page">
            <div style={{
              padding: "20px",
              background: "#28A745",
              color: "white",
              borderRadius: "8px",
              width: "200px"
            }}>
              <h3>Total Students</h3>
              <p style={{ fontSize: "28px" }}>{getCount()}</p>
            </div>
          </div>
        )}

        {/* CREATE */}
        {page === "create" && (
          <div className="page">
            <h2 style={{ color: "red", fontSize: "35px" }}>Create Account</h2>

            <select value={dept} onChange={e => setDept(e.target.value)}>
              <option value="">--Select Dept--</option>
              <option value="cse">CSE</option>
              <option value="eee">EEE</option>
              <option value="ece">ECE</option>
              <option value="civil">CIVIL</option>
              <option value="mech">MECH</option>
            </select>

            <br /><br />

            <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
            <br /><br />

            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
            <br /><br />

            <input value={pwd} onChange={e => setPwd(e.target.value)} placeholder="Password" />
            <br /><br />

            <button onClick={createAccount}>Create</button>
          </div>
        )}

        {/* VIEW */}
        {page === "view" && (
          <div className="page">
            <h2 style={{ color: "red", fontSize: "35px" }}>Accounts</h2>

            <select value={viewDept} onChange={e => setViewDept(e.target.value)}>
              <option value="">--Select Dept--</option>
              <option value="all">All</option>
              <option value="cse">CSE</option>
              <option value="eee">EEE</option>
              <option value="ece">ECE</option>
              <option value="civil">CIVIL</option>
              <option value="mech">MECH</option>
            </select>

            <br /><br />

            {viewDept && (
              <table border="1">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Roll No</th>
                    <th>Name</th>
                    <th>Dept</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((u, i) => (
                    <tr key={u.email}>
                      <td>{i + 1}</td>
                      <td>{u.email.split("@")[0]}</td>
                      <td>{u.name}</td>
                      <td>{u.dept}</td>
                      <td>
                        <button onClick={() => deleteAcc(u.email)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* MARK ATTENDANCE */}
        {page === "mark" && (
          <div className="page">
            <h2 style={{ color: "red", fontSize: "35px" }}>Mark Attendance</h2>

            <select value={markDept} onChange={e => setMarkDept(e.target.value)}>
              <option value="">--Select Dept--</option>
              <option value="cse">CSE</option>
              <option value="eee">EEE</option>
              <option value="ece">ECE</option>
              <option value="civil">CIVIL</option>
              <option value="mech">MECH</option>
            </select>

            <br /><br />

            <input type="date" value={markDate} onChange={e => setMarkDate(e.target.value)} />

            <br /><br />

            {markDept && (
              <table border="1">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Roll</th>
                    <th>Name</th>
                    <th>Present</th>
                  </tr>
                </thead>

                <tbody>
                  {getStudents()
                    .filter(s => s.dept === markDept)
                    .map((s, i) => (
                      <tr key={s.email}>
                        <td>{i + 1}</td>
                        <td>{s.email.split("@")[0]}</td>
                        <td>{s.name}</td>
                        <td>
                          <input data-roll={s.email.split("@")[0]} type="checkbox" />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}

            <br />
            <button onClick={saveAttendance}>Save</button>
          </div>
        )}

        {/* VIEW ATTENDANCE */}
        {page === "views" && (
          <div className="page">
            <h2 style={{ color: "red", fontSize: "35px" }}>Attendance</h2>

            <select value={viewAttDept} onChange={e => setViewAttDept(e.target.value)}>
              <option value="">--Select Dept--</option>
              <option value="cse">CSE</option>
              <option value="eee">EEE</option>
              <option value="ece">ECE</option>
              <option value="civil">CIVIL</option>
              <option value="mech">MECH</option>
            </select>

            <br /><br />

            <select value={period} onChange={e => setPeriod(e.target.value)}>
              <option value="">--Select Period--</option>
              <option value="overall">Overall</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>

            <br /><br />

            {viewAttDept && period && (
  <>
    <table border="1">
      <thead>
        <tr>
          <th>S.No</th>
          <th>Roll</th>
          <th>Name</th>
          <th>%</th>
        </tr>
      </thead>

      <tbody>
        {report.map((r, i) => (
          <tr key={r.roll}>
            <td>{i + 1}</td>
            <td>{r.roll}</td>
            <td>{r.name}</td>
            <td>{r.percent}%</td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* 🔥 BUTTON MUST BE HERE */}
    <br />
    <button onClick={downloadAttendance}>
      Download 
    </button>
  </>
)}
          </div>
        )}

      </div>
    </div>
  );
}