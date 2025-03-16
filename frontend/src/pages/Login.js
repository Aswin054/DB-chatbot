import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import "./Login.css";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();

        // Simulating role-based login (Replace this with backend authentication)
        const roleBasedRedirects = {
            "student@gmail.com": "/student",
            "mentor@gmail.com": "/mentor",
            "classteacher@gmail.com": "/class-teacher",
            "hod@gmail.com": "/hod",
        };

        if (roleBasedRedirects[email]) {
            navigate(roleBasedRedirects[email]);
        } else {
            alert("Invalid email or role not recognized!");
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <h2 className="college-name">PANIMALAR ENGINEERING COLLEGE</h2>
                <h3 className="login-title">INFO-BOT LOGIN</h3>
                <form onSubmit={handleLogin}>
                    <div className="input-container">
                        <i><FaEnvelope /></i>
                        <input
                            type="email"
                            placeholder="Gmail ID"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-container">
                        <i><FaLock /></i>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
