import React, { useState, useContext } from 'react';
import { authContext } from './auth-context';
import LocalLoginPage from './LocalLoginPage';

function LoginPage() {
    const { googleLoginHandler, facebookLoginHandler } = useContext(authContext);
    const [isLocalLogin, setLocalLogin] = useState(false); // State for login through page
    const handlePageLoginClick = () => {
        setLocalLogin(true);
    }

    if (isLocalLogin) {
        return (<LocalLoginPage/>)
    }
    else {
    return (
        <>
            <div className="h-dvh flex flex-col items-center justify-centerh-screen mt-3">
                <h2 className="text-2xl font-semibold mb-3">Login Page</h2>
                <button onClick={googleLoginHandler} className='flex self-start gap-2 p-4 mx-auto mt-6 font-medium text-white align-middle bg-gray-700 rounded-full'>
                    Google
                </button>
                <button onClick={facebookLoginHandler} className='flex self-start gap-2 p-4 mx-auto mt-6 font-medium text-white align-middle bg-gray-700 rounded-full'>
                    Facebook
                </button> {/* FIXME */}
                <button onClick={handlePageLoginClick} className='flex self-start gap-2 p-4 mx-auto mt-6 font-medium text-white align-middle bg-gray-700 rounded-full'>
                    Log in & Sign Up Through Page
                </button>
            </div>
            
        
        </>
    )
    }
    }
        

export default LoginPage;
