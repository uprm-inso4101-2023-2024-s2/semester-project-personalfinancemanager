import React, { useState } from 'react';
import PwdChangePage from './PasswordChanged';

function ForgotPasswordPage({ onReturnHome }) {
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [passwordChanged, setPasswordChanged] = useState(false);

    const handleConfirmPasswordChange = () => {
        setPasswordChanged(true);
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    
    if(passwordChanged){
        return <PwdChangePage onReturnHome={onReturnHome} />;
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-2xl font-semibold mb-3">Forgot Password Page</h2>
            <div className="flex flex-col gap-4">
                <div>
                    <label className="block">Enter New Password:</label>
                    <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="border px-3 py-1 rounded text-black" />
                        <button className="absolute top-1/2 right-2 transform -translate-y-1/2 text-black" onClick={toggleShowPassword}>{showPassword ? 'Hide' : 'Show'}</button>
                    </div>
                </div>
                <div>
                    <label className="block">Confirm New Password:</label>
                    <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="border px-3 py-1 rounded text-black" />
                </div>
            </div>
            <button onClick={handleConfirmPasswordChange} className="bg-green-500 text-white px-4 py-2 rounded mt-3">Confirm Password Change</button>
        </div>
    );
}

export default ForgotPasswordPage;