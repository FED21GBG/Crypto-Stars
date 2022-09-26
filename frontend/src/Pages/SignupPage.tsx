import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  async function signUp() {
    if (username.length > 0 && password.length > 0 && email.length > 0) {
      const user = {
        username: username,
        password: password,
        email: email,
        role: "guest",
      };
      const response = await fetch("http://localhost:2009/api/signup", {
        method: "POST",
        body: JSON.stringify(user),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      console.log(data);
      if (data.success) {
        localStorage.setItem("username", user.username);
        navigate("/LoginPage");
      } else {
        alert("user already excists, pick another name or password :)");
      }
    } else {
      alert("Skriv nått förfan");
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
        />
        <input
          type="password"
          id="password"
          placeholder="Lösenord"
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="email"
          id="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="btn" onClick={() => signUp()}>
          Skapa konto
        </button>
      </section>
    </section>
  );
}

export default SignupPage;
