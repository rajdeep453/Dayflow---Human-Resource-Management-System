const API = "http://localhost:3000";

function login() {
  fetch(API + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email.value,
      password: password.value
    })
  })
  .then(r => r.json())
  .then(user => {
    localStorage.setItem("user", JSON.stringify(user));
    window.location = "dashboard.html";
  })
  .catch(() => alert("Login failed"));
}

const user = JSON.parse(localStorage.getItem("user"));
if (user) {
  document.getElementById("role").innerText = user.role.toUpperCase();
  if (user.role === "admin") employee.style.display = "none";
  else admin.style.display = "none";
}

function markAttendance() {
  fetch(API + "/attendance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: user.email, date: new Date() })
  }).then(() => alert("Attendance marked"));
}

function applyLeave() {
  fetch(API + "/leave", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: user.email })
  }).then(() => alert("Leave applied"));
}

function loadLeaves() {
  fetch(API + "/leaves")
    .then(r => r.json())
    .then(data => {
      leaves.innerHTML = "";
      data.forEach(l => {
        leaves.innerHTML += `<li>${l.email} - ${l.status}
        <button onclick="update('${l.email}','Approved')">Approve</button>
        <button onclick="update('${l.email}','Rejected')">Reject</button></li>`;
      });
    });
}

function update(email, status) {
  fetch(API + "/leave/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, status })
  }).then(loadLeaves);
}
