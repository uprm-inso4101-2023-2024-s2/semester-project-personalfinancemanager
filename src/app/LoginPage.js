import React, { useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faL } from '@fortawesome/free-solid-svg-icons';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { authContext } from './auth-context';

function LoginPage({ currentPage, setCurrentPage }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { googleLoginHandler, facebookLoginHandler } = useContext(authContext);

    
    const handleLogin = () => {
        setCurrentPage('');
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    if (currentPage=='login') {
        return (
            <>
            {(
            <div className="flex flex-col items-center justify-centerh-screen">
                <h2 className="text-2xl font-semibold mb-3">Login Page</h2>
                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block">Email:</label>
                        <div className="relative">
                            <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white-500" />
                            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 border px-3 py-1 rounded text-white" />
                        </div>
                    </div>
                    <div>
                        <label className="block">Password:</label>
                        <div className="relative">
                            <FontAwesomeIcon icon={faKey} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white-500" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 border px-3 py-1 rounded text-white" // Added padding-right to prevent text overlap
                            />
                            <FontAwesomeIcon
                                icon={showPassword ? faEye : faEyeSlash}
                                className="eye-icon px-2"
                                onClick={toggleShowPassword}
                            />
                        </div>
                    </div>
                </div>
                <button onClick={setCurrentPage('')} className="bg-green-500 text-white px-4 py-2 rounded mt-3">Login</button>
                <button onClick={googleLoginHandler} className='flex self-start gap-2 p-4 mx-auto mt-6 font-medium text-white align-middle bg-gray-700 rounded-full'>Google</button>
                <button onClick={facebookLoginHandler} className='flex self-start gap-2 p-4 mx-auto mt-6 font-medium text-white align-middle bg-gray-700 rounded-full'>Facebook</button> {/* FIXME */}
                <button onClick={setCurrentPage('signup')} className="text-blue-500 py-6 hover:underline">Don't have an account? Sign up</button>
            </div>
            )}
            </>
        );
    }
}

export default LoginPage;
