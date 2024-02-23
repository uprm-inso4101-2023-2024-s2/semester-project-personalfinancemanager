import React, { useState } from 'react';
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

function SignUpPage({ onSignUp }) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [birthDate, setBirthDate] = useState({ day: '', month: '', year: '' });
    const [gender, setGender] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoginPage, setLoginPage] = useState(false);

    
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSignUp = () => {
        onSignUp({ fullName, email, password, phone, birthDate, gender });
    };

    const handleLoginClick = () => {
        setLoginPage(true); 
    };

    return (
        <>
        {isLoginPage && (
            <LoginPage onLogin={handleLoginClick} />
            )}
        {!isLoginPage && (
        <div className="flex flex-col items-center justify-center h-screen" style={{ backgroundColor: 'white',  color: 'black', margin: '-10vh' }}>
            <h2 className="text-2xl font-semibold mb-3">Create Account</h2>
            <div className="flex flex-col gap-4">
                <div>
                    <label className="block">Full name:</label>
                    <div className="relative">
                        <FontAwesomeIcon icon={faUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="pl-10 border px-3 py-1 rounded text-black" />
                    </div>
                </div>
                <div>
                    <label className="block">Email address:</label>
                    <div className="relative">
                        <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 border px-3 py-1 rounded text-black" />
                    </div>
                </div>
                <div>
                    <label className="block">Password:</label>
                    <div className="relative">
                        <FontAwesomeIcon icon={faKey} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 border px-3 py-1 rounded text-black" // Added padding-right to prevent text overlap
                        />
                        <FontAwesomeIcon
                            icon={showPassword ? faEye : faEyeSlash}
                            className="eye-icon px-2"
                            onClick={toggleShowPassword}
                        />
                    </div>
                </div>
                <div>
                    <label className="block">Mobile phone number:</label>
                    <div className="relative">
                        <FontAwesomeIcon icon={faPhone} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10 border px-3 py-1 rounded text-black" />
                    </div>
                </div>
                <label className="block" style={{ marginBottom: '-14px' }}>Date of birth:</label> 
                 <div className="flex gap-3">
                    <div>
                        <select value={birthDate.day} onChange={(e) => setBirthDate({...birthDate, day: e.target.value})} className="border px-3 py-1 rounded text-black">
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
