import React, { useState } from 'react';
import ForgotPasswordPage from './NewPassword';
import ForgotPassword from './ForgotPassword';

function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isForgotPassword, setShowForgotPassword] = useState(false); // New state for rendering ForgotPassword
    const [isLoginPage, setLoginPage] = useState(true);

    const handleLogin = () => {
        // Other login logic, for now, just the email
        onLogin(email);
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleForgotPasswordClick = () => {
        setShowForgotPassword(true);
        setLoginPage(false);
    };

    return (isLoginPage ? (
        <div className="flex flex-col items-center h-screen">
            <h2 className="text-2xl font-semibold mb-3">Login Page</h2>
            <div className="flex flex-col gap-4">
                <div>
                    <label className="block">Email:</label>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="border px-3 py-1 rounded text-black" />
                </div>
                <div>
                    <label className="block">Password:</label>
                    <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="border px-3 py-1 rounded text-black" />
                        <button className="absolute top-1/2 right-2 transform -translate-y-1/2 text-black" onClick={toggleShowPassword}>{showPassword ? 'Hide' : 'Show'}</button>
                    </div>
                    <button className="text-white underline mt-2" onClick={handleForgotPasswordClick}>Forgot Password?</button>
                </div>
                <button onClick={handleLogin} className="bg-green-500 text-white px-4 py-2 rounded mt-3">Login</button>
            </div>
            <div className="mt-3 text-white">
                No account? <button className="underline" onClick={() => console.log("Create an account")}>Create One</button>
            </div>
        </div>
    ) : (
        isForgotPassword && <ForgotPassword/>
    )
    );
}

export default LoginPage;
