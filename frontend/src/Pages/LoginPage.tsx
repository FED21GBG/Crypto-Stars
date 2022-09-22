import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("guest");

  useEffect(() => {
    console.log(role);
  }, [role]);

  async function Login() {
    const user = {
      username: username,
      password: password,
      role: { role },
    };

    const response = await fetch("http://localhost:2009/api/login", {
      method: "POST",
      body: JSON.stringify(user),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    console.log(data);
    if (data.success) {
      navigate("/CameraPage");
      localStorage.setItem("username", data.user);
    } else {
      alert(
        "This account does not excist. Please sign up to use this amazing app:)"
      );
    }
  }
  return (
    <section>
      LoginPage
      <input
        type="text"
        id="username"
        placeholder="username"
        onChange={(e) => setUsername(e.target.value)}
      ></input>
      <input
        type="password"
        id="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      ></input>{" "}
      <label>
        Guest:
        <input
          type="radio"
          name="role"
          id="guest"
          value="guest"
          defaultChecked
          onChange={(e) => setRole(e.target.value)}
        ></input>
      </label>
      <label>
        Admin:
        <input
          type="radio"
          name="role"
          id="admin"
          value="admin"
          onChange={(e) => setRole(e.target.value)}
        ></input>
      </label>
      <button onClick={() => Login()}>Login</button>
      <button onClick={() => navigate("/SignupPage")}>Sign Up</button>
    </section>
  );
}

export default LoginPage;
