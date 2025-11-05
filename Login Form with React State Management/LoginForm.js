import React, { useState } from "react";

const LoginForm = () => {
  // Step 1: Define state variables for username, password, and error message
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Step 2: Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload

    if (!username || !password) {
      setError("Please enter both username and password!");
    } else {
      setError("");
      console.log("Username:", username);
      console.log("Password:", password);
      alert(`Login successful!\nUsername: ${username}`);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Login Form</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            placeholder="Enter username"
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            placeholder="Enter password"
          />
        </div>

        {error && <p style={styles.error}>{error}</p>}

        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
    </div>
  );
};

// Inline CSS styling
const styles = {
  container: {
    maxWidth: "350px",
    margin: "80px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    backgroundColor: "#f9f9f9",
    textAlign: "center",
  },
  heading: {
    color: "#333",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  inputGroup: {
    textAlign: "left",
  },
  label: {
    display: "block",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  input: {
    width: "100%",
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    backgroundColor: "#007BFF",
    color: "white",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontSize: "0.9em",
  },
};

export default LoginForm;
