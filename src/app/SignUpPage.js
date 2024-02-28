import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faKey } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import LoginPage from './LoginPage';
import { faVenus } from '@fortawesome/free-solid-svg-icons';
import { faMars } from '@fortawesome/free-solid-svg-icons';
import { faGenderless } from '@fortawesome/free-solid-svg-icons';

function SignUpPage({ onSignUp, currentPage, setCurrentPage }) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [birthDate, setBirthDate] = useState({ day: '', month: '', year: '' });
    const [gender, setGender] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [confirmPasswordErrors, setConfirmPasswordErrors] = useState([]);
    let errors = [];

    useEffect(() => {
        if (email) {
            setIsEmailValid(/^.+@.+\..+$/.test(email));
        }
        if (email.length==0) {
            setIsEmailValid(true);
        }

        if (password.length < 8) {
            errors.push("Your password needs to be at least 8 characters long.");
        }
        if (!/[A-Z]/.test(password)) {
            errors.push("Your password needs an uppercase character.");
        }
        if (!/[a-z]/.test(password)) {
            errors.push("Your password needs a lowercase character.");
        }
        if (!/\d/.test(password)) {
            errors.push("Your password needs a number.");
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push("Your password needs a special character.");
        }
        if (password.length==0) {
            setPasswordErrors([]);
        }
        if (password) {
            setPasswordErrors(errors);
        }
        if (password && confirmPassword && password !== confirmPassword) {
            setConfirmPasswordErrors("The passwords do not match.");
        } else {
            setConfirmPasswordErrors('');
        }
    }, [email, password, confirmPassword, errors]);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSignUp = () => {
        onSignUp({ fullName, email, password, phone, birthDate, gender });
    };

    const handleLoginClick = (L) => {
        setCurrentPage('login');
        
    };

    return (
        <>
        {currentPage=='login' && (
            <LoginPage onLogin currentPage={currentPage} />
            )}
        {currentPage=='signup' && (
        <div className="flex flex-col items-center justify-center h-screen" style={{ backgroundColor: 'black',  color: 'white', margin: '-10vh' }}>
            <h2 className="text-2xl font-semibold mb-3">Create Account</h2>
            <div className="flex flex-col gap-4">
                <div>
                    <label className="block">Full name:</label>
                    <div className="relative">
                        <FontAwesomeIcon icon={faUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="pl-10 pr-10 border px-3 py-1 rounded text-black" />
                    </div>
                </div>
                <div>
                    <label className="block">Email address:</label>
                    <div className="relative">
                        <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`pl-10 pr-10 border px-3 py-1 rounded text-black ${!isEmailValid ? 'border-red-500' : ''}`} // Agrega estilos de error condicionalmente.
                        />
                    </div>
                    {!isEmailValid && <p className="text-red-500 mt-2">Email is invalid</p>} {/* Mensaje de error */}
                </div>
                <div>
                    <label className="block">Password:</label>
                    <div className="relative">
                        <FontAwesomeIcon icon={faKey} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`pl-10 pr-10 border px-3 py-1 rounded text-black ${passwordErrors.length > 0 ? 'border-red-500' : ''}`}
                        />
                        <FontAwesomeIcon
                            icon={showPassword ? faEye : faEyeSlash}
                            onClick={toggleShowPassword}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                        />
                    </div>
                    {passwordErrors.length > 0 && (
                        <ul className="text-red-500 mt-2">
                            {passwordErrors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    )}
                </div>
                {password.length > 1 && ( /* Confirm Password Feature */
                    <div>
                        <label className="block">Confirm Password:</label>
                        <div className="relative">
                            <FontAwesomeIcon icon={faKey} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={`pl-10 pr-10 border px-3 py-1 rounded text-black ${confirmPasswordErrors ? 'border-red-500' : ''}`}
                            />
                            <FontAwesomeIcon
                                icon={showPassword ? faEye : faEyeSlash}
                                onClick={toggleShowPassword}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                            />
                        </div>
                        {confirmPasswordErrors && <p className="text-red-500 mt-2">{confirmPasswordErrors}</p>}
                    </div>
                )}
                <div>
                    <label className="block">Mobile phone number:</label>
                    <div className="relative">
                        <FontAwesomeIcon icon={faPhone} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10 pr-10 border px-3 py-1 rounded text-black" />
                    </div>
                </div>
                <label className="block" style={{ marginBottom: '-14px' }}>Date of birth:</label> 
                 <div className="flex gap-3">
                    <div>
                        <select value={birthDate.day} onChange={(e) => setBirthDate({...birthDate, day: e.target.value})} className="border px-4 py-1 rounded text-black">
                            <option value="">DD</option>
                            {[...Array(31)].map((_, index) => {
                                const day = index + 1;
                                return <option key={day} value={day}>{day}</option>;
                            })}
                        </select>
                    </div>
                    <div>
                        <select value={birthDate.month} onChange={(e) => setBirthDate({...birthDate, month: e.target.value})} className="border px-3 py-1 rounded text-black">
                            <option value="">MM</option>
                            {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, index) => {
                                return <option key={month} value={index + 1}>{month}</option>;
                            })}
                        </select>
                    </div>
                    <div>
                        <select value={birthDate.year} onChange={(e) => setBirthDate({...birthDate, year: e.target.value})} className="border px-3 py-1 rounded text-black">
                            <option value="">YYYY</option>
                            {[...Array(124)].map((_, index) => {
                                const year = 2024 - index;
                                return <option key={year} value={year}>{year}</option>;
                            })}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block">Gender (optional):</label>
                    <div className="relative">
                        <FontAwesomeIcon icon={gender == "female" ? faVenus : (gender == "male" ? faMars : faGenderless)} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <select value={gender} onChange={(e) => setGender(e.target.value)} className="pl-10 border px-3 py-1 rounded text-black">
                            <option value="">Select...</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="unknown">Prefer not to say</option>
                        </select>
                    </div>
                </div>
            </div>
            <button onClick={handleSignUp} className="bg-blue-500 text-white px-4 py-2 rounded mt-7">Sign Up</button>
            <div>
            Already have an account? <button onClick={handleLoginClick} className="text-blue-500 py-6 hover:underline">Log in</button>
            </div>
        </div>
        )}
        </>
    );
}

export default SignUpPage;
