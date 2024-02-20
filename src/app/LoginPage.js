import React, { useState, useContext } from 'react';
import { authContext } from './auth-context';

function LoginPage() {
    const { googleLoginHandler } = useContext(authContext);


    return (
        <>
            <div className="h-dvh flex flex-col items-center justify-centerh-screen mt-3">
                <h2 className="text-2xl font-semibold mb-3">Login Page</h2>
                <div className="flex flex-col gap-4">
                    {/* <div>
                        <label className="block">Email:</label>
                        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} className="border px-3 py-1 rounded text-black" />
                    </div>
                    <div>
                        <label className="block">Password:</label>
                        <div className="relative">
                            <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="border px-3 py-1 rounded text-black" />
                            <button className="absolute top-1/2 right-2 transform -translate-y-1/2 text-black" onClick={toggleShowPassword}>{showPassword ? 'Hide' : 'Show'}</button>
                        </div>
                    </div> */}
                    <div>
                        
                    </div>
                </div>
                <button onClick={googleLoginHandler} className='flex self-start gap-2 p-4 mx-auto mt-6 font-medium text-white align-middle bg-gray-700 rounded-full'>
                            Google
                </button>
            </div>
            
        
        </>
        
        
    );
}

export default LoginPage;
