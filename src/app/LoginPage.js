import React, { useState } from 'react';

function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        // Other login logic, for now, just the email
        onLogin(email);
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="flex flex-col items-center justify-centerh-screen">
            <h2 className="text-2xl font-semibold mb-3">Login Page</h2>
            <div className="flex flex-col gap-4">
                <div>
                    <label className="block">Email:</label>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="border px-3 py-1 rounded" />
                </div>
                <div>
                    <label className="block">Password:</label>
                    <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="border px-3 py-1 rounded" />
                        <button className="absolute top-1/2 right-2 transform -translate-y-1/2" onClick={toggleShowPassword}>{showPassword ? 'Hide' : 'Show'}</button>
                    </div>
                </div>
            </div>
            <button onClick={handleLogin} className="bg-green-500 text-white px-4 py-2 rounded mt-3">Login</button>
        </div>
    );
}

export default LoginPage;
