import React, { useEffect, useState } from "react";
import "./hod.css";

export default function Hod() {

  const [page, setPage] = useState("home");

  const [type, setType] = useState("faculty");
  const [dept, setDept] = useState("");
  const [name, setName] = useState("");

  // ✅ FIXED EMAIL NAME
  const [emailInput, setEmailInput] = useState("");

  const [pwd, setPwd] = useState("");

  const [viewType, setViewType] = useState("");
  const [viewDept, setViewDept] = useState("");

  const [attDept, setAttDept] = useState("");
  const [attPeriod, setAttPeriod] = useState("");

  const [rolePwd, setRolePwd] = useState("");
  const [deptPwd, setDeptPwd] = useState("");
  const [emailPwd, setEmailPwd] = useState("");
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");

  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || currentUser.role !== "hod") {
      alert("Please login first");
      window.location.href = "/";
    }
  }, []);

  function logout() {
    localStorage.removeItem("currentUser");
    window.location.reload();
  }

  // ---------------- CREATE ACCOUNT ----------------
  function createAccount() {
    let users = JSON.parse(localStorage.getItem(type)) || [];

    if (!name || !emailInput || !pwd || !dept) {
      alert("Fill all fields");
      return;
    }

    if (users.some(u => u.email === emailInput)) {
      alert("Email already exists!");
      return;
    }

    users.push({
      name,
      email: emailInput,
      password: pwd,
      dept
    });

    localStorage.setItem(type, JSON.stringify(users));

    alert("Account Created");

    setName("");
    setEmailInput("");
    setPwd("");
    setDept("");

    setRefresh(r => r + 1);
  }

  // ---------------- DELETE ----------------
  function deleteAcc(role, email) {
    let users = JSON.parse(localStorage.getItem(role)) || [];
    users = users.filter(u => u.email !== email);
    localStorage.setItem(role, JSON.stringify(users));
    setRefresh(r => r + 1);
  }

  // ---------------- VIEW ACCOUNTS ----------------
  function getFilteredUsers() {
    let users = JSON.parse(localStorage.getItem(viewType)) || [];

    if (viewDept && viewDept !== "all") {
      users = users.filter(u => u.dept === viewDept);
    }

    return users;
  }

  const usersList = getFilteredUsers();

  // ---------------- ATTENDANCE ----------------
  function getAttendanceList() {
    let students = JSON.parse(localStorage.getItem("student")) || [];
    students = students.filter(s => s.dept === attDept);

    let attendance = JSON.parse(localStorage.getItem("attendance")) || {};
    let data = attendance[attDept] || {};

    let today = new Date();

    return students.map((s, index) => {
      let roll = s.email.split("@")[0];

      let total = 0;
      let present = 0;

      Object.entries(data).forEach(([date, day]) => {
        let d = new Date(date);
        let diff = (today - d) / (1000 * 60 * 60 * 24);

        let include =
          attPeriod === "overall" ||
          (attPeriod === "weekly" && diff <= 7) ||
          (attPeriod === "monthly" && diff <= 30);

        if (include && day[roll]) {
          total++;
          if (day[roll] === "Present") present++;
        }
      });

      let percent = total ? Math.round((present / total) * 100) : 0;

      return {
        index,
        roll,
        name: s.name,
        percent
      };
    });
  }

  const attendanceList =
    attDept && attPeriod ? getAttendanceList() : [];

  // ---------------- PASSWORD CHANGE ----------------
  function changePassword() {
    let users = JSON.parse(localStorage.getItem(rolePwd)) || [];

    let found = false;

    users.forEach(u => {
      if (u.email === emailPwd && u.dept === deptPwd) {
        if (u.password !== oldPwd) {
          alert("Old password incorrect");
          return;
        }
        u.password = newPwd;
        found = true;
      }
    });

    if (!found) {
      alert("User not found");
      return;
    }

    localStorage.setItem(rolePwd, JSON.stringify(users));
    alert("Password Updated");

    setEmailPwd("");
    setOldPwd("");
    setNewPwd("");
  }

  return (
    <div id="dashboard">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>HOD SPACE</h2>
        <ul>
          <li onClick={() => setPage("home")}>Dashboard</li>
          <li onClick={() => setPage("create")}>Create Accounts</li>
          <li onClick={() => setPage("view")}>View Accounts</li>
          <li onClick={() => setPage("views")}>View Student Attendance</li>
          <li onClick={() => setPage("settings")}>Settings</li>
          <li onClick={logout}>Logout</li>
        </ul>
      </div>

      <div className="content">

        {page === "home" && (
  <div className="page">


    <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>

      <div style={{
        padding: "20px",
        background: "#28A745",
        color: "white",
        borderRadius: "10px",
        minWidth: "200px"
      }}>
        <h3>Total Faculty</h3>
        <p style={{ fontSize: "30px" }}>
          {JSON.parse(localStorage.getItem("faculty") || "[]").length}
        </p>
      </div>

      <div style={{
        padding: "20px",
        background: "#FF5733",
        color: "white",
        borderRadius: "10px",
        minWidth: "200px"
      }}>
        <h3>Total Students</h3>
        <p style={{ fontSize: "30px" }}>
          {JSON.parse(localStorage.getItem("student") || "[]").length}
        </p>
      </div>

     

    </div>
  </div>
)}

        {/* CREATE */}
        {page === "create" && (
          <div className="page">
            <h2 style={{ color: "red", fontSize: "35px" }}>Create Account</h2>

            <select value={type} onChange={e => setType(e.target.value)}>
              <option value="faculty">Faculty</option>
              <option value="student">Student</option>
            </select>

            <br /><br />

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

            <input value={emailInput} onChange={e => setEmailInput(e.target.value)} placeholder="Email" />
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

            <select value={viewType} onChange={e => setViewType(e.target.value)}>
              <option value="">--Select Role--</option>
              <option value="faculty">Faculty</option>
              <option value="student">Student</option>
            </select>

            <br /><br />

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
            {viewType !== "" && viewDept !== "" && (
  <h2 style={{ color: "blue", fontSize: "30px" }}>
    {viewType === "faculty"
      ? "Faculty Accounts"
      : "Student Accounts"}
  </h2>
)}

            {viewType!=="" && viewDept!=="" && (
              
              <table border="1">
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Dept</th>
                    <th>Delete</th>
                  </tr>
                </thead>

                <tbody>
                  {usersList.map((u, i) => (
                    <tr key={u.email}>
                      <td>{i + 1}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.dept}</td>
                      <td>
                        <button onClick={() => deleteAcc(viewType, u.email)}>
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

        {/* ATTENDANCE */}
        {page === "views" && (
          <div className="page">
            <h2 style={{ color: "red", fontSize: "35px" }}>Attendance</h2>

            <select value={attDept} onChange={e => setAttDept(e.target.value)}>
              <option value="">--Select Dept--</option>
              <option value="cse">CSE</option>
              <option value="eee">EEE</option>
              <option value="ece">ECE</option>
              <option value="civil">CIVIL</option>
              <option value="mech">MECH</option>
            </select>

            <br /><br />

            <select value={attPeriod} onChange={e => setAttPeriod(e.target.value)}>
              <option value="">--Select Period--</option>
              <option value="overall">Overall</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>

            <br /><br />

            {attDept && attPeriod && (
  <>
    <table border="1">
      <thead>
        <tr>
          <th>S.No</th>
          <th>Roll</th>
          <th>Name</th>
          <th>Percentage</th>
        </tr>
      </thead>

      <tbody>
        {attendanceList.map((s, i) => (
          <tr key={s.roll}>
            <td>{i + 1}</td>
            <td>{s.roll}</td>
            <td>{s.name}</td>
            <td>{s.percent}%</td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* 🔥 DOWNLOAD BUTTON */}
    <br />
    <button
      onClick={() => {
        let csv = "S.No,Roll,Name,Percentage\n";

        attendanceList.forEach((s, i) => {
          csv += `${i + 1},${s.roll},${s.name},${s.percent}%\n`;
        });

        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `attendance_${attDept}_${attPeriod}.csv`;
        a.click();
      }}
    >
      Download
    </button>
  </>
)}
          </div>
        )}

        {/* SETTINGS */}
        {page === "settings" && (
          <div className="page">
            <h2 style={{ color: "red", fontSize: "35px" }}>Change Password</h2>

            <select value={rolePwd} onChange={e => setRolePwd(e.target.value)}>
              <option value="">--Select Role--</option>
              <option value="faculty">Faculty</option>
              <option value="student">Student</option>
            </select>

            <br /><br />

            <select value={deptPwd} onChange={e => setDeptPwd(e.target.value)}>
              <option value="">--Select Dept--</option>
              <option value="cse">CSE</option>
              <option value="eee">EEE</option>
              <option value="ece">ECE</option>
              <option value="civil">CIVIL</option>
              <option value="mech">MECH</option>
            </select>

            <br /><br />

            <input value={emailPwd} onChange={e => setEmailPwd(e.target.value)} placeholder="Email" />
            <br /><br />

            <input value={oldPwd} onChange={e => setOldPwd(e.target.value)} placeholder="Old Password" />
            <br /><br />

            <input value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder="New Password" />
            <br /><br />

            <button onClick={changePassword}>Update</button>
          </div>
        )}

      </div>
    </div>
  );
}