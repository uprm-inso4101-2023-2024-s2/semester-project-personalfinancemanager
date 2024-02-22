'use client';
import React, { useState } from 'react';

function Nav({ showUserBar }) {
    return (
        <header className="container max-w-2x-1 px-6 py-6 mx-auto">
            <div className="flex items-center justify-between">
                {/* User information */}
                {showUserBar && (
                    <div className="flex items-center gap-2">
                        <div className="h-[40px] w-[40px] rounded-full overflow-hidden"> 
                            {/* img */}
                            <img
                                className="object-cover w-full h-full"
                                src="https://thispersondoesnotexist.com/" 
                                alt="Profile image" />
                        </div>
                        
                        {/* name */}
                        <small>Hi, User!</small>
                    </div>
    )}
                <nav className="flex items-center gap-4">
                </nav>
            </div>
        </header>
    );
}

export default Nav;