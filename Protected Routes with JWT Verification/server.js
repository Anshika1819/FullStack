// Import dependencies
const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Secret key for signing JWT
const SECRET_KEY = "mysecretkey123";

// Hardcoded user (for demo)
const user = {
  username: "admin",
  password: "12345",
};

// ✅ Login Route - issues JWT token
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check credentials
  if (username === user.username && password === user.password) {
    // Create JWT token
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

// ✅ Middleware to verify JWT
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  // Token format: "Bearer <token>"
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(403).json({ message: "Token missing" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Invalid or expired token" });
    req.user = decoded;
    next();
  });
}

// ✅ Protected Route
app.get("/protected", verifyToken, (req, res) => {
  res.json({
    message: "Access granted to protected route!",
    user: req.user,
  });
});

// Start server
app.listen(5000, () => console.log("✅ Server running on port 5000"));
