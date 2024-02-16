'use client';

import React, { useState } from 'react';
import RenderBarChart from './barChart';
import theNothinger from './somethingElse';
import ExpenseCategoryItem from './ExpenseCategoryItem';
import LoginPage from './LoginPage'; // imports the LoginPage components

function Home() {
    const [showBarChart, setShowBarChart] = useState(false);
    const [isLoginPage, setLoginPage] = useState(false);

    const toggleChange = () => {
        setShowBarChart(!showBarChart);
    };

    const handleLoginButtonClick = () => {
        setLoginPage(true); // Show the login page when the button is clicked
    };

    const handleLogin = (email) => {
        setLoginPage(false);
    };

    return (
        <>
            {isLoginPage ? (
                <LoginPage onLogin={handleLogin} />
            ) : (
                <main className="container max-w-2x1 px-6 mx-auto">
                    {/* Login button */}
                    <div className="flex justify-end mt-1">
                        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleLoginButtonClick}>Login</button>
                    </div>

                    <section className="py-3">
                        <small className="text-gray-400 text-md">My Balance</small>
                        <h2 className="text-4x1 font-bold">$100</h2>
                    </section>

                    {/* Add Expenses feature */}
                    <section>
                        <h3 className="flex-2x1">My Expenses</h3>
                        <div className="flex flex-col gap-2 mt-6">
                            <ExpenseCategoryItem color={'#014'} title={'Mock-cost'} total={300} />
                            <ExpenseCategoryItem color={'#032'} title={'Mock-cost'} total={125} />
                            <ExpenseCategoryItem color={'#121'} title={'Mock-cost'} total={200} />
                        </div>
                    </section>

                    <div className="mt-2 group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
                        <button onClick={toggleChange}>{showBarChart ? 'Show Nothing' : 'Show Bar Chart'}</button>
                    </div>
                    <section className="max-w-2x1 px-6 mx-auto">{showBarChart ? <RenderBarChart /> : <theNothinger />}</section>
                </main>
            )}
        </>
    );
}

export default Home;
