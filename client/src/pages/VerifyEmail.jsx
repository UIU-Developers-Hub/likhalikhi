import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyEmail } from "../services/authenticationsServices.js";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isVerified, setIsVerified] = useState(false); // State to track if email is verified
  const [isLoading, setIsLoading] = useState(true); // State to track loading state

  useEffect(() => {
    const token = new URLSearchParams(location.search).get("token");
    const id = new URLSearchParams(location.search).get("id");

    const verifyToken = async () => {
      try {
        const response = await verifyEmail(id, token);

        setMessage(response.data.message);
        if (response.data.success) {
          setIsVerified(true); // Set isVerified to true if verification is successful
        }
      } catch (err) {
        setMessage("Verification failed. Please try again.");
      } finally {
        setIsLoading(false); // Set loading state to false after verification attempt
      }
    };

    verifyToken();
  }, [location]);

  if (isLoading) {
    return (
      <div className="bg-cusLightBG dark:bg-cusDarkBG min-h-screen flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-cusPrimaryColor"></div>
      </div>
    );
  }

  return (
    <div className="bg-cusLightBG dark:bg-cusDarkBG min-h-screen flex items-center justify-center p-4">
      <div className="bg-white dark:bg-cusLightDarkBG p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl text-center font-bold mb-4 text-cusPrimaryColor dark:text-cusSecondaryLightColor">
          Email Verification
        </h2>
        <p className="mb-4 text-center text-cusPrimaryColor dark:text-cusSecondaryLightColor">
          {message}
        </p>
        {isVerified && (
          <button
            onClick={() => navigate("/login")}
            className="w-full p-2 bg-cusPrimaryColor text-white rounded hover:bg-opacity-90 dark:bg-cusSecondaryColor"
          >
            Go to Login
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
