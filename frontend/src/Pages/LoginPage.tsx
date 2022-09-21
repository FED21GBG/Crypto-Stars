import { useNavigate } from "react-router-dom";
import { useState } from "react";

function LoginPage() {

    const navigate = useNavigate()

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    async function Login() {
        const user = {
            username: username,
            password: password
        }

        const response = await fetch('http://localhost:2009/api/login', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: { 'Content-Type': 'application/json' }
        })

        const data = await response.json();
        console.log(data);
        if (data.success) {
            navigate('/CameraPage')
            localStorage.setItem('username', data.user)
        } else {
            alert('This account does not excist. Please sign up to use this amazing app:)')
        }

    }
    return (

        <section>LoginPage
            <input type='text' id='username' placeholder='username' onChange={(e) => setUsername(e.target.value)}></input>
            <input type='password' id='password' placeholder='password' onChange={(e) => setPassword(e.target.value)}></input>
            <button onClick={() => Login()}>Login</button>
            <button onClick={() => navigate('/SignupPage')}>Sign Up</button>

        </section>
    );
}

export default LoginPage;