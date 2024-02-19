import React, { useState } from 'react';

function SignUpPage({ onSignUp }) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [birthDate, setBirthDate] = useState({ day: '', month: '', year: '' });
    const [gender, setGender] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSignUp = () => {
        // Other sign-up logic
        onSignUp({ fullName, email, password, phone, birthDate, gender });
    };

    return (
        <div className="flex flex-col items-center justify-start h-screen">
            <h2 className="text-2xl font-semibold mb-3">Sign Up</h2>
            <div className="flex flex-col gap-4">
                <div>
                    <label className="block">Full name:</label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="border px-3 py-1 rounded text-black" />
                </div>
                <div>
                    <label className="block">Email address:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border px-3 py-1 rounded text-black" />
                </div>
                <div>
                    <label className="block">Password:</label>
                    <div className="relative">
                        <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border px-3 py-1 rounded text-black" // Added padding-right to prevent text overlap
                        />
                        <button
                        className="absolute inset-y-0 right-0 px-16 py-1 text-sm font-medium text-black"
                        onClick={toggleShowPassword}
                        type="button"
                        >
                        {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                </div>
                <div>
                    <label className="block">Mobile phone number:</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="border px-3 py-1 rounded text-black" />
                </div>
                <div className="flex gap-3">
                    <div>
                        <label className="block">Birth month:</label>
                        <select value={birthDate.year} onChange={(e) => setBirthDate({...birthDate, year: e.target.value})} className="border px-3 py-1 rounded text-black">
                            <option value="">Year</option>
                            {[...Array(124)].map((_, index) => {
                                const year = 2024 - index;
                                return <option key={year} value={year}>{year}</option>;
                            })}
                        </select>
                    </div>
                    <div>
                        <label className="block">Day:</label>
                        <select value={birthDate.day} onChange={(e) => setBirthDate({...birthDate, day: e.target.value})} className="border px-3 py-1 rounded text-black">
                            <option value="">Day</option>
                            {[...Array(31)].map((_, index) => {
                                const day = index + 1;
                                return <option key={day} value={day}>{day}</option>;
                            })}
                        </select>
                    </div>
                    <div>
                        <label className="block">Year:</label>
                        <select value={birthDate.month} onChange={(e) => setBirthDate({...birthDate, month: e.target.value})} className="border px-3 py-1 rounded text-black">
                            <option value="">Month</option>
                            {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month, index) => {
                                return <option key={month} value={index + 1}>{month}</option>;
                            })}
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block">Gender (optional):</label>
                    <select value={gender} onChange={(e) => setGender(e.target.value)} className="border px-3 py-1 rounded text-black">
                        <option value="">Select...</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="unknown">Prefer not to say</option>
                    </select>
                </div>
            </div>
            <button onClick={handleSignUp} className="bg-blue-500 text-white px-4 py-2 rounded mt-3">Sign Up</button>
        </div>
    );
}

export default SignUpPage;
