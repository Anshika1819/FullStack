// Import dependencies
const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Secret key for signing JWT
const SECRET_KEY = "mysecretkey123";

// Mock users with roles
const users = [
  { username: "admin", password: "admin123", role: "Admin" },
  { username: "mod", password: "mod123", role: "Moderator" },
  { username: "user", password: "user123", role: "User" },
];

// ✅ Login Route - issues JWT with role
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Create JWT including the user's role
  const token = jwt.sign(
    { username: user.username, role: user.role },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  res.json({
    message: "Login successful",
    token,
    role: user.role,
  });
});

// ✅ Middleware: Verify JWT and attach user info to request
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(403).json({ message: "Token missing" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err)
      return res.status(401).json({ message: "Invalid or expired token" });

    req.user = decoded; // { username, role }
    next();
  });
}

// ✅ Middleware: Role-based access control
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied: ${req.user.role} role is not authorized.`,
      });
    }
    next();
  };
}

// ✅ Protected Routes

// Accessible only by Admin
app.get("/admin/dashboard", verifyToken, authorizeRoles("Admin"), (req, res) => {
  res.json({
    message: "Welcome to the Admin Dashboard!",
    user: req.user,
  });
});

// Accessible only by Moderator
app.get(
  "/moderator/manage",
  verifyToken,
  authorizeRoles("Moderator", "Admin"), // Admin can also access
  (req, res) => {
    res.json({
      message: "Moderator Management Panel Access Granted!",
      user: req.user,
    });
  }
);

// Accessible by all authenticated users
app.get("/user/profile", verifyToken, (req, res) => {
  res.json({
    message: "Welcome to your profile page!",
    user: req.user,
  });
});

// Start the server
app.listen(5000, () => console.log("✅ Server running on port 5000"));
