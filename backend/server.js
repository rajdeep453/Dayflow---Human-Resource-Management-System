const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = "./backend/data.json";

const readData = () => JSON.parse(fs.readFileSync(DATA_FILE));
const writeData = (data) => fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const data = readData();
  const user = data.users.find(
    u => u.email === email && u.password === password
  );
  if (!user) return res.status(401).json({ msg: "Invalid credentials" });
  res.json(user);
});

app.post("/attendance", (req, res) => {
  const data = readData();
  data.attendance.push(req.body);
  writeData(data);
  res.json({ msg: "Attendance marked" });
});

app.post("/leave", (req, res) => {
  const data = readData();
  data.leaves.push({ ...req.body, status: "Pending" });
  writeData(data);
  res.json({ msg: "Leave applied" });
});

app.get("/leaves", (req, res) => {
  const data = readData();
  res.json(data.leaves);
});

app.post("/leave/update", (req, res) => {
  const data = readData();
  const leave = data.leaves.find(l => l.email === req.body.email);
  if (leave) leave.status = req.body.status;
  writeData(data);
  res.json({ msg: "Updated" });
});

app.listen(3000, () => console.log("Backend running on port 3000"));
