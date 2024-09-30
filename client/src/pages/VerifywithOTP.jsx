import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const VerifywithOTP = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const navigate = useNavigate();

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      // Move to next input if not the last one
      if (value && index < 3) {
        document.getElementById(`otp-${index + 1}`).focus();
      }
    }
  };

  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    // Add logic to verify the OTP
    console.log("OTP entered:", otpCode);
  };

  return (
    <div className="bg-cusLightBG dark:bg-cusDarkBG min-h-screen flex items-center justify-center p-4">
      <div className="bg-white dark:bg-cusLightDarkBG p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-cusPrimaryColor dark:text-cusSecondaryLightColor">
          Verify Email Address
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="flex justify-between mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                className="w-12 h-12 text-center text-xl border rounded dark:bg-cusDarkBG border-cusPrimaryColor dark:border-cusSecondaryColor focus:outline-none focus:ring-2 focus:ring-cusPrimaryColor"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full p-2 bg-cusPrimaryColor text-white rounded hover:bg-opacity-90 dark:bg-cusSecondaryColor"
          >
            Verify OTP
          </button>
        </form>

        <button
          onClick={handleBack}
          className="mt-4 p-2 text-cusSecondaryColor dark:text-cusSecondaryLightColor underline"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default VerifywithOTP;
