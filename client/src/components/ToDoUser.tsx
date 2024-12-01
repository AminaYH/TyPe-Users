import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import User from "../models/User";
import "./login.css";

interface LoginProps {
    setIsLoggedIn: (value: boolean) => void;
}

const Login = ({ setIsLoggedIn }: LoginProps) => {
    const [username, setUsername] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [error, setError] = useState<string>("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:8000/login", {
                username,
                email,
            });

            if (response.status === 200) {
                // Check if user data exists in the response
                const user = response.data.user; // Accessing the nested `user` object
                const username = user.username;  // Extract the username

                // Save the username to localStorage
                localStorage.setItem('username', username);

                console.log('Username saved to localStorage:', username);

                // Update the login state
                setIsLoggedIn(true);

                // Redirect to the todo page
                navigate("/todo");
            } else {
                setError(response.data.msg || "Login failed. Please try again.");
            }
        } catch (err: any) {
            setError(err.response?.data?.msg || "An error occurred. Please try again.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div>
                        <label>Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error">{error}</p>}
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
