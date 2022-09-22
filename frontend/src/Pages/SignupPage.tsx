import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  async function signUp() {
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
      localStorage.setItem("username", data.user);
      navigate("/CameraPage");
    } else {
      alert("user already excists, pick another name or password :)");
    }
  }

  return (
    <section>
      SignupPage
      <input
        type="text"
        id="username"
        placeholder="username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        id="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="email"
        id="email"
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={() => signUp()}>Signup</button>
    </section>
  );
}

export default SignupPage;
