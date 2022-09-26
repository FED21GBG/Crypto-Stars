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
      role: role,
    };

    const response = await fetch("http://localhost:2009/api/login", {
      method: "POST",
      body: JSON.stringify(user),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    console.log(data);
    if (data.success) {
      localStorage.setItem("username", data.user);
      sessionStorage.setItem("token", data.token);
      navigate("/CameraPage");
    } else {
      alert(
        "This account does not excist or wrong role. Either sign up or check your role ;)"
      );
    }
  }
  return (
    <section className="container">
      <section className="login-section">
        <input
          className=""
          type="text"
          id="username"
          placeholder="Användarnamn"
          onChange={(e) => setUsername(e.target.value)}
        ></input>
        <input
          type="password"
          id="password"
          placeholder="Lösenord"
          onChange={(e) => setPassword(e.target.value)}
        ></input>{" "}
        <section className="roles-container">
          <label>
            Gäst
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
            Admin
            <input
              type="radio"
              name="role"
              id="admin"
              value="admin"
              onChange={(e) => setRole(e.target.value)}
            ></input>
          </label>
        </section>
        <button className="btn" onClick={() => Login()}>
          Logga in
        </button>
        <button className="btn" onClick={() => navigate("/SignupPage")}>
          Registrera konto
        </button>
      </section>
    </section>
  );
}

export default LoginPage;
