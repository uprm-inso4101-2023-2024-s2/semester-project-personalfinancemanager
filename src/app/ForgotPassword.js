import React, { useState } from 'react';
import ForgotPasswordPage from './NewPassword';


function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isShowForgotPassword, setShowForgotPassword] = useState(true);
    const [isShowResetPassword, setShowResetPassword] = useState(false);

    const handleResetPasswordClick = () => {
        setShowForgotPassword(false);
        setShowResetPassword(true)
    };

    return (isShowForgotPassword ? (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-2xl font-semibold mb-3">Forgot Password</h2>
            <div className="flex flex-col gap-4">
                <div>
                    <label className="block">Email:</label>
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="border px-3 py-1 rounded text-black" />
                </div>
            </div>
            <button onClick={handleResetPasswordClick} className="bg-green-500 text-white px-4 py-2 rounded mt-3">Reset Password</button>
        </div>
    ) : (
        isShowResetPassword && <ForgotPasswordPage/>
    )
    );
}

export default ForgotPassword;
