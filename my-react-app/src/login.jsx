import React, { useState } from "react";
import "./login.css";


export default function Login() {
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState("");

  const login = () => {
    setMsg("");

    if (!email || !pass) {
      setMsg("Please fill all details");
      return;
    }

    let currentUser = null;

    if (role === "admin" && email === "admin" && pass === "admin123") {
      currentUser = { email: email, role: "admin" };
    } else {
      let users = JSON.parse(localStorage.getItem(role)) || [];
      let user = users.find(
        (u) => u.email === email && u.password === pass
      );

      if (user) {
        currentUser = { email: user.email, role: role };
      } else {
        setMsg("Invalid Credentials");
        return;
      }
    }

    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    if (currentUser.role === "admin") window.location.href = "/admin";
    else if (currentUser.role === "hod") window.location.href = "/hod";
    else if (currentUser.role === "faculty") window.location.href = "/faculty";
    else if (currentUser.role === "student") window.location.href = "/student";
  };

  return (
    <div id="loginPage">
      <div className="login-box">
        <h2 style={{ color: "#333"}}>--- LOGIN ---</h2>

        <div id="loginMsg">{msg}</div>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="admin">Admin</option>
          <option value="hod">HOD</option>
          <option value="faculty">Faculty</option>
          <option value="student">Student</option>
        </select>

        <br />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br />

        <input
          type="password"
          placeholder="Password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />

        <br />

        <button onClick={login}>Login</button>
      </div>
    </div>
  );
}