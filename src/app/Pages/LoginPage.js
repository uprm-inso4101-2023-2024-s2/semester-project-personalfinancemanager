import React, { useState, useContext, useEffect } from 'react';
import Head from 'next/head'
import { 
    FaFacebookF, 
    FaLinkedinIn, 
    FaGoogle, 
    FaRegEnvelope,
} from 'react-icons/fa'
import {MdLockOutline} from 'react-icons/md'
import { authContext } from '../Page-Functionality/Login/auth-context';
import EncryptionPasswordModal from '../Modals/EncryptionPasswordModal';

function LoginPage({currentPage, setCurrentPage}) {
    const { user, encryptionPassword, googleLoginHandler, facebookLoginHandler } = useContext(authContext);
    const [showEncryptionPasswordModal, setShowEncryptionPasswordModal] = useState(false);

    useEffect(() => {
        if (user && !encryptionPassword) {
            setShowEncryptionPasswordModal(true)
        }
    }, [user, encryptionPassword, showEncryptionPasswordModal]);

    if (currentPage=='login') {
        return (
            <div className='flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100' style={{ backgroundColor: '#1E2022' }}>
                <Head>
                    <title>Create Next App</title>
                    <link rel='icon' href='/favicon.ico'/>
                </Head>
            

            <main className='flex flex-col items-center justify-center w-full flex-1 px-20 text-center'>

            <EncryptionPasswordModal show={showEncryptionPasswordModal} onClose={setShowEncryptionPasswordModal} />

            <div className='bg-white rounded-2xl shadow-2xl flex w-2/3 max-w-4xl' style={{ backgroundColor: '#181A1B' }}>
                    <div className='w-3/5 p-5'>
                        <div className='py-10'>
                            <h2 className='text-3xl font-bold text-green-500 mb-2'>
                                Sign in to Account
                            </h2>
                            <div className='border-2 w-10 border-green-500 inline-block mb-2'></div>
                            <div className='flex justify-center my-2'>
                                <button onClick={facebookLoginHandler} className='border-2 border-gray-200 rounded-full p-3 mx-1' style={{ borderColor: '#232628' }}>
                                    <FaFacebookF className='text-sm text-gray-400' style={{ color: '#938E86' }}/>
                                </button>
                                <button onClick={googleLoginHandler} className='border-2 border-gray-200 rounded-full p-3 mx-1' style={{ borderColor: '#232628' }}>
                                    <FaGoogle className='text-sm text-gray-400' style={{ color: '#938E86' }}/>
                                </button>
                            </div>
                            <p className='text-gray-400 my-3' style={{ color: '#938E86' }}> or use your email account</p>
                            <div className='flex flex-col items-center'>
                                <div className='bg-gray-100 w-64 p-2 flex items-center mb-3' style={{ backgroundColor: '#1E2022' }}>
                                    <FaRegEnvelope className='text-gray-400 m-2' style={{ color: '#AFA99E' }}/>
                                    <input type='email' name='email' placeholder='Email' className='bg-gray-100 outline-none text-sm flex-1' style={{ backgroundColor: '#1E2022' }}/>
                                </div>
                                <div className='bg-gray-100 w-64 p-2 flex items-center mb-3 ' style={{ backgroundColor: '#1E2022' }}>
                                    <MdLockOutline className='text-gray-400 m-2' style={{ color: '#AFA99E' }}/>
                                    <input type='password' name='password' placeholder='Password' className='bg-gray-100 outline-none text-sm flex-1' style={{ backgroundColor: '#1E2022' }}/>
                                </div>
                                <div className='flex justify-between w-64 mb-5'>
                                    <label className='flex items-center text-xs'><input type='checkbox' name='remember' className='mr-1'/> Remember me</label>
                                    <button onClick={() => setCurrentPage('forgotpassword')} className='flex items-center text-xs'>Forgot password?</button>
                                    
                                </div>
                                <button onClick={() => setShowEncryptionPasswordModal(true)} className='border-2 border-green-500 text-green-500 rounded-full px-12 py-2 inline-block font-semibold hover:bg-green-500 hover:text-white'>Sign In</button>
                            </div>
                        </div>
                    </div>

                    <div className='w-2/5 bg-green-500 text-white rounded-tr-2xl rounded-br-2xl py-36 px-12'>
                        <h2 className='text-3xl font-bold mb-2'>Hello, Friend!</h2>
                        <div className='border-2 w-10 border-white inline-block mb-2'></div>
                        <p className='mb-10'>
                            Fill up personal information and start journey with us.
                        </p>
                        <button onClick={() => setCurrentPage('signup')} className='border-2 border-white rounded-full px-12 py-2 inline-block font-semibold hover:bg-white hover:text-green-500'>
                            Sign Up
                        </button>
                        
                    </div>
                </div>
            </main>

            </div>
                

        )
    }
}
        
export default LoginPage;