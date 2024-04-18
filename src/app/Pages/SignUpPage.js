import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import LoginPage from "./LoginPage";
import { faVenus } from "@fortawesome/free-solid-svg-icons";
import { faMars } from "@fortawesome/free-solid-svg-icons";
import { faGenderless } from "@fortawesome/free-solid-svg-icons";

function SignUpPage({ currentPage, setCurrentPage }) {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [birthDate, setBirthDate] = useState({ day: "", month: "", year: "" });
    const [gender, setGender] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [passwordErrors, setPasswordErrors] = useState([]);
    const [confirmPasswordErrors, setConfirmPasswordErrors] = useState([]);
    let errors = [];

    useEffect(() => {
        if (email) {
            setIsEmailValid(/^.+@.+\..+$/.test(email));
        }
        if (email.length == 0) {
            setIsEmailValid(true);
        }

        if (password.length < 8) {
            errors.push("Your password needs to be at least 8 characters long.");
        }
        if (!/[A-Z]/.test(password)) {
            errors.push("Your password needs an uppercase character.");
        }
        if (!/[a-z]/.test(password)) {
            errors.push("Your password needs a lowercase character.");
        }
        if (!/\d/.test(password)) {
            errors.push("Your password needs a number.");
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push("Your password needs a special character.");
        }
        if (password.length == 0) {
            setPasswordErrors([]);
        }
        if (password) {
            setPasswordErrors(errors);
        }
        if (password && confirmPassword && password !== confirmPassword) {
            setConfirmPasswordErrors("The passwords do not match.");
        } else {
            setConfirmPasswordErrors("");
        }
    }, [email, password, confirmPassword, errors]);

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSignUp = () => {
        setCurrentPage("home");
    };

    const handleLoginClick = () => {
        setCurrentPage("login");
    };

    return (
        <>
            {currentPage == "login" && (
                <LoginPage currentPage={currentPage} setCurrentPage={setCurrentPage} />
            )}
            {currentPage == "signup" && (
                <div
                    className="flex flex-col items-center justify-center min-h-screen"
                    style={{ backgroundColor: "#1E2022", color: "white" }}
                >
                    <h2 className="text-3xl font-bold text-green-500 mb-3">
                        Create Account
                    </h2>
                    <div
                        className="w-full max-w-md bg-gray-100 rounded-2xl shadow-2xl p-5"
                        style={{ backgroundColor: "#181A1B" }}
                    >
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-gray-400">Full name:</label>
                                <div className="relative">
                                    <FontAwesomeIcon
                                        icon={faUser}
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="pl-10 pr-10 border-none rounded text-white w-full"
                                        style={{ backgroundColor: "#1E2022" }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-400">Email address:</label>
                                <div className={`relative ${!isEmailValid ? 'mb-6' : 'mb-2'}`}> {/* Adjust margin based on error presence */}
                                    <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={`pl-10 pr-10 rounded text-white w-full ${!isEmailValid ? 'border-red-500' : ''}`}
                                        style={{ backgroundColor: '#1E2022', borderColor: '#232628' }}
                                    />
                                </div>
                                {!isEmailValid && (
                                    <div className="text-red-500 text-sm">Email is invalid</div>
                                )}
                            </div>
                            <div>
                                <label className="block text-gray-400">Password:</label>
                                <div
                                    className={`relative ${passwordErrors.length > 0 ? "mb-6" : "mb-2"
                                        }`}
                                >
                                    {" "}
                                    {/* Adjust margin based on error presence */}
                                    <FontAwesomeIcon
                                        icon={faKey}
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`pl-10 pr-10 rounded text-white w-full ${passwordErrors.length > 0 ? "border-red-500" : ""
                                            }`}
                                        style={{ backgroundColor: "#1E2022" }}
                                    />
                                    <FontAwesomeIcon
                                        icon={showPassword ? faEye : faEyeSlash}
                                        onClick={toggleShowPassword}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                                    />
                                </div>
                                <div className="text-red-500 text-sm">
                                    {passwordErrors.map((error, index) => (
                                        <div key={index}>{error}</div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-400">Confirm Password:</label>
                                <div className={`relative ${confirmPasswordErrors ? 'mb-6' : 'mb-2'}`}> {/* Adjust margin based on error presence */}
                                    <FontAwesomeIcon icon={faKey} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={`pl-10 pr-10 rounded text-white w-full ${confirmPasswordErrors ? 'border-red-500' : ''}`}
                                        style={{ backgroundColor: '#1E2022' }}
                                    />
                                </div>
                                {confirmPasswordErrors && (
                                    <div className="text-red-500 text-sm">{confirmPasswordErrors}</div>
                                )}
                            </div>
                            <div>
                                <label className="block text-gray-400">
                                    Mobile phone number:
                                </label>
                                <div className="relative">
                                    <FontAwesomeIcon
                                        icon={faPhone}
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    />
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="pl-10 pr-10 rounded text-white w-full"
                                        style={{ backgroundColor: "#1E2022" }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-400">Date of birth:</label>
                                <div className="flex gap-3">
                                    <select
                                        value={birthDate.day}
                                        onChange={(e) =>
                                            setBirthDate({ ...birthDate, day: e.target.value })
                                        }
                                        className="border-none rounded text-white px-4 py-1"
                                        style={{ backgroundColor: "#1E2022" }}
                                    >
                                        <option value="">DD</option>
                                        {[...Array(31)].map((_, index) => (
                                            <option key={index} value={index + 1}>
                                                {index + 1}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={birthDate.month}
                                        onChange={(e) =>
                                            setBirthDate({ ...birthDate, month: e.target.value })
                                        }
                                        className="border-none rounded text-white px-3 py-1"
                                        style={{ backgroundColor: "#1E2022" }}
                                    >
                                        <option value="">MM</option>
                                        {[
                                            "January",
                                            "February",
                                            "March",
                                            "April",
                                            "May",
                                            "June",
                                            "July",
                                            "August",
                                            "September",
                                            "October",
                                            "November",
                                            "December",
                                        ].map((month, index) => (
                                            <option key={index} value={index + 1}>
                                                {month}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        value={birthDate.year}
                                        onChange={(e) =>
                                            setBirthDate({ ...birthDate, year: e.target.value })
                                        }
                                        className="border-none rounded text-white px-3 py-1"
                                        style={{ backgroundColor: "#1E2022" }}
                                    >
                                        <option value="">YYYY</option>
                                        {[...Array(100)].map((_, index) => {
                                            const year = new Date().getFullYear() - index;
                                            return (
                                                <option key={index} value={year}>
                                                    {year}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-gray-400">
                                    Gender (optional):
                                </label>
                                <div className="relative">
                                    <FontAwesomeIcon
                                        icon={
                                            gender === "female"
                                                ? faVenus
                                                : gender === "male"
                                                    ? faMars
                                                    : faGenderless
                                        }
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                    />
                                    <select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="pl-10 pr-10 rounded text-white w-full"
                                        style={{ backgroundColor: "#1E2022" }}
                                    >
                                        <option value="">Select...</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                        <option value="unknown">Prefer not to say</option>
                                    </select>
                                </div>
                            </div>
                            <button
                                onClick={handleSignUp}
                                className="border-2 border-green-500 text-green-500 rounded-full px-12 py-2 inline-block font-semibold hover:bg-green-500 hover:text-white transition-colors duration-300 mt-4"
                            >
                                Sign Up
                            </button>
                            <div className="text-center mt-4">
                                Already have an account?{" "}
                                <button
                                    onClick={handleLoginClick}
                                    className="text-green-500 hover:underline"
                                >
                                    Log in
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default SignUpPage;
