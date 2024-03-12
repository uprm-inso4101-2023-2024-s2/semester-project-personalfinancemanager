import React, { useState } from 'react';
import ResetPasswordPage from './NewPassword';


function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [isShowResetPassword, setShowResetPassword] = useState(false);

    const handleResetPasswordClick = () => {
        setShowResetPassword(true)
    };

    if (isShowResetPassword) {
        return (<ResetPasswordPage />)
    }
    else {
        return (
            <div className="flex flex-col items-center h-screen mx-4 sm:mx-auto sm:w-full md:w-2/3 lg:w-1/2">
                <h2 className="text-2xl font-semibold mb-3">Forgot Password</h2>
                <div className="flex flex-col gap-4 w-full">
                    <div>
                        <label className="block">Email:</label>
                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="border px-3 py-1 rounded text-black w-full" />
                    </div>
                </div>
                <button onClick={handleResetPasswordClick} className="bg-green-500 text-white px-4 py-2 rounded mt-3">Reset Password</button>
            </div>
        );
    }
}

export default ForgotPassword;
