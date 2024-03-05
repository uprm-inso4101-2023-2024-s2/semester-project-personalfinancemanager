import React, { useState } from "react";
import Home from "../../page.js";

function PwdChangePage({ onReturnHome }) {
  const [mainPage, setMainPage] = useState(false);

  const handleBackToMainClick = () => {
    setMainPage(true); // Show the login page when the button is clicked
  };

  return (
    <>
      {mainPage ? (
        <Home onLogin={() => setMainPage(false)} />
      ) : (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h1 style={{ fontSize: "36px" }}>Congratulations!</h1>{" "}
          <p style={{ fontSize: "18px" }}>
            You have successfully changed your password.
          </p>
          <button
            onClick={handleBackToMainClick}
            className="bg-green-500 text-white px-4 py-2 rounded mt-3"
          >
            Back to Main Page
          </button>
        </div>
      )}
    </>
  );
}

export default PwdChangePage;