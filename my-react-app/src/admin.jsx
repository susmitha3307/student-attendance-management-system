import React, { useEffect, useState } from "react";
import "./admin.css";

export default function Admin() {

  const [page, setPage] = useState("home");

  const [type, setType] = useState("hod");
  const [dept, setDept] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const [viewType, setViewType] = useState("");
  const [viewDept, setViewDept] = useState("");

  const [cat, setCat] = useState("hod");
  const [deptForUser, setDeptForUser] = useState("");
  const [mail, setMail] = useState("");
  const [old, setOld] = useState("");
  const [newp, setNewp] = useState("");

  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser || currentUser.role !== "admin") {
      alert("Please login first");
      window.location.href = "/";
    }
  }, []);

  function logout() {
    localStorage.removeItem("currentUser");
    window.location.reload();
  }

  function createAccount() {
    let users = JSON.parse(localStorage.getItem(type)) || [];

    if (users.some(u => u.email === email)) {
      alert("Email already exists!");
      return;
    }

    let currentUser = JSON.parse(localStorage.getItem("currentUser"));

    users.push({
      name,
      email,
      password: pwd,
      dept,
      createdBy: currentUser?.email
    });

    localStorage.setItem(type, JSON.stringify(users));

    alert("Account Created");

    setName("");
    setEmail("");
    setPwd("");
    setDept("");

    setRefresh(r => r + 1);
  }

  function deleteAcc(emailToDelete) {
    let users = JSON.parse(localStorage.getItem(viewType)) || [];

    users = users.filter(u => u.email !== emailToDelete);

    localStorage.setItem(viewType, JSON.stringify(users));

    setRefresh(r => r + 1);
  }

  function changePassword() {
    let users = JSON.parse(localStorage.getItem(cat)) || [];

    let u = users.find(x =>
      x.email === mail &&
      x.dept === deptForUser
    );

    if (!u || u.password !== old) {
      alert("Invalid details");
      return;
    }

    u.password = newp;

    localStorage.setItem(cat, JSON.stringify(users));

    alert("Password Updated");

    setMail("");
    setOld("");
    setNewp("");
  }

  function getCount(role) {
    let users = JSON.parse(localStorage.getItem(role)) || [];
    return users.length;
  }

  function loadAccounts() {
    let users = JSON.parse(localStorage.getItem(viewType)) || [];

    if (viewDept && viewDept !== "all") {
      users = users.filter(u => u.dept === viewDept);
    }

    return users;
  }

  return (
    <div className="dashboard">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>ADMIN SPACE</h2>
        <ul>
          <li onClick={() => setPage("home")}>Dashboard</li>
          <li onClick={() => setPage("create")}>Create Account</li>
          <li onClick={() => setPage("view")}>View Accounts</li>
          <li onClick={() => setPage("settings")}>Settings</li>
          <li onClick={logout}>Logout</li>
        </ul>
      </div>

      {/* CONTENT */}
      <div className="content">

        {/* HOME */}
        {page === "home" && (
          <div id="dashboardCards">
            <div className="card" style={{ background: "#FF5733" }}>
              <h3>Total HODs</h3>
              <p>{getCount("hod")}</p>
            </div>

            <div className="card" style={{ background: "#33A1FF" }}>
              <h3>Total Faculty</h3>
              <p>{getCount("faculty")}</p>
            </div>

            <div className="card" style={{ background: "#28A745" }}>
              <h3>Total Students</h3>
              <p>{getCount("student")}</p>
            </div>
          </div>
        )}

        {/* CREATE */}
        {page === "create" && (
          <div>
            <h2 className="title" style={{ color: "red", fontSize: "35px" }}>
              Create Account
            </h2>

            <select value={type} onChange={e => setType(e.target.value)}>
              <option value="hod">HOD</option>
              <option value="faculty">Faculty</option>
              <option value="student">Student</option>
            </select>

            <br /><br />

            <select value={dept} onChange={e => setDept(e.target.value)}>
              <option value="">--Select dept--</option>
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

            <input type="password" value={pwd} onChange={e => setPwd(e.target.value)} placeholder="Password" />
            <br /><br />

            <button onClick={createAccount}>Create</button>
          </div>
        )}

        {/* VIEW */}
        {page === "view" && (
          <div>
            <h2 className="title" style={{ color: "red", fontSize: "35px" }}>
              Accounts
            </h2>

            <select value={viewType} onChange={e => setViewType(e.target.value)}>
              <option value="">--Select Role--</option>
              <option value="hod">HOD</option>
              <option value="faculty">Faculty</option>
              <option value="student">Student</option>
            </select>

            <br /><br />

            <select value={viewDept} onChange={e => setViewDept(e.target.value)}>
              <option value="">--Select dept--</option>
              <option value="all">All Depts</option>
              <option value="cse">CSE</option>
              <option value="eee">EEE</option>
              <option value="ece">ECE</option>
              <option value="civil">CIVIL</option>
              <option value="mech">MECH</option>
            </select>

            {viewType && viewDept && (
              <>
                <h2 style={{ color: "blue", marginTop: "35px" }}>
                  {viewType.toUpperCase()} ACCOUNTS
                </h2>

                <table>
                  <thead>
                    <tr>
                      <th>S.No</th>
                      {viewType === "student" ? (
                        <>
                          <th>Roll No</th>
                          <th>Name</th>
                          <th>Dept</th>
                          <th>Delete</th>
                        </>
                      ) : (
                        <>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Dept</th>
                          <th>Delete</th>
                        </>
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {loadAccounts().map((u, i) => (
                      <tr key={u.email}>
                        <td>{i + 1}</td>

                        {viewType === "student" ? (
                          <>
                            <td>{u.email.split("@")[0]}</td>
                            <td>{u.name}</td>
                            <td>{u.dept}</td>
                          </>
                        ) : (
                          <>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>{u.dept}</td>
                          </>
                        )}

                        <td>
                          <button onClick={() => deleteAcc(u.email)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
        )}

        {/* SETTINGS */}
        {page === "settings" && (
          <div>
            <h2 style={{ color: "red", fontSize: "35px" }}>
              Change Password
            </h2>

            <select value={cat} onChange={e => setCat(e.target.value)}>
              <option value="hod">HOD</option>
              <option value="faculty">Faculty</option>
              <option value="student">Student</option>
            </select>

            <br /><br />

            <select value={deptForUser} onChange={e => setDeptForUser(e.target.value)}>
              <option value="">--Select Dept--</option>
              <option value="cse">CSE</option>
              <option value="eee">EEE</option>
              <option value="ece">ECE</option>
              <option value="civil">CIVIL</option>
              <option value="mech">MECH</option>
            </select>

            <br /><br />

            <input value={mail} onChange={e => setMail(e.target.value)} placeholder="Email" />
            <br /><br />

            <input value={old} onChange={e => setOld(e.target.value)} placeholder="Old Password" />
            <br /><br />

            <input value={newp} onChange={e => setNewp(e.target.value)} placeholder="New Password" />
            <br /><br />

            <button onClick={changePassword}>Update</button>
          </div>
        )}

      </div>
    </div>
  );
}