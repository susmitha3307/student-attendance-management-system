import React, { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";
import "./student.css";

function Student() {
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState("home");
  const [period, setPeriod] = useState("");
  const [chartInstance, setChartInstance] = useState(null);
  const [tableData, setTableData] = useState([]);

  const chartRef = useRef(null); // ✅ React way

  // ---------------- LOAD USER ----------------
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    setCurrentUser(user);

    if (user && !user.dept) {
      let students = JSON.parse(localStorage.getItem("student")) || [];
      let found = students.find(s => s.email === user.email);

      if (found) {
        user.dept = found.dept;
        setCurrentUser({ ...user });
      }
    }
  }, []);

  // ---------------- ATTENDANCE LOGIC ----------------
  useEffect(() => {
    if (!period || !currentUser || page !== "attendance") return;

    setTimeout(() => {
      const attendanceData =
        JSON.parse(localStorage.getItem("attendance")) || {};

      const dept = currentUser.dept;
      const roll = currentUser.email.split("@")[0];

      let today = new Date();
      let filtered = [];

      if (attendanceData[dept]) {
        Object.keys(attendanceData[dept]).forEach(date => {
          let dayData = attendanceData[dept][date];
          let attDate = new Date(date);
          let diff = (today - attDate) / (1000 * 60 * 60 * 24);

          let include = false;

          if (period === "overall") include = true;
          if (period === "weekly" && diff <= 7) include = true;
          if (period === "monthly" && diff <= 30) include = true;

          if (include && dayData[roll]) {
            filtered.push({ date, status: dayData[roll] });
          }
        });
      }

      setTableData(filtered);

      let present = filtered.filter(a => a.status === "Present").length;
      let absent = filtered.filter(a => a.status === "Absent").length;

      // ---------------- CLEAN CHART (NO DOM) ----------------
      if (!chartRef.current) return;

      if (chartInstance) {
        chartInstance.destroy();
      }

      const isWeekly = period === "weekly";

      const newChart = new Chart(chartRef.current, {
        type: "doughnut",
        data: {
          labels: ["Present", "Absent"],
          datasets: [
            {
              data: [present, absent],
              backgroundColor: ["#28A745", "#DC3545"]
            }
          ]
        },
        options: {
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  let value = context.raw;

                  if (isWeekly) {
                    return context.label + ": " + value;
                  }

                  let total = context.dataset.data.reduce((a, b) => a + b, 0);
                  let percent =
                    total === 0 ? 0 : ((value / total) * 100).toFixed(0);

                  return context.label + ": " + percent + "%";
                }
              }
            }
          }
        }
      });

      setChartInstance(newChart);
    }, 100);
  }, [period, currentUser, page]);

  // ---------------- PERCENTAGE ----------------
  const percent =
    tableData.length > 0
      ? (
          (tableData.filter(a => a.status === "Present").length /
            tableData.length) *
          100
        ).toFixed(0)
      : 0;

  // ---------------- LOGOUT ----------------
  const logout = () => {
    localStorage.removeItem("currentUser");
    window.location.reload();
  };

  return (
    <>
      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>STUDENT SPACE</h2>
        <ul>
          <li onClick={() => setPage("home")}>Dashboard</li>
          <li onClick={() => setPage("attendance")}>Attendance</li>
          <li onClick={logout}>Logout</li>
        </ul>
      </div>

      {/* CONTENT */}
      <div className="content">

        {/* HOME */}
        {page === "home" && (
          <div className="page">
            <div className="card" style={{ background: "#28A745" }}>
              <h3>
                Welcome{" "}
                {currentUser?.name ||
                  currentUser?.email?.split("@")[0]}
              </h3>
            </div>
          </div>
        )}

        {/* ATTENDANCE */}
        {page === "attendance" && (
          <div className="page">
            <h2 style={{ color: "red" }}>Your Attendance</h2>

            <select
              value={period}
              onChange={e => setPeriod(e.target.value)}
            >
              <option value="">Select Period</option>
              <option value="overall">Overall</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>

            {/* HEADING */}
            <br/>
            {period && (
              <h3 style={{ color: "blue", marginTop: "10px" }}>
                {period} Attendance: {percent}%
              </h3>
            )}

            <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>

              {/* TABLE */}
              <div style={{ flex: 1 }}>
                {period === "weekly" && (
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((a, i) => (
                        <tr key={i}>
                          <td>{a.date}</td>
                          <td>{a.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* CHART */}
              <div style={{ flex: 1 }}>
                <canvas ref={chartRef} height="200"></canvas>
              </div>

            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Student;