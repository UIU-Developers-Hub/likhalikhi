import { useState } from "react";
import { Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  register,
  resendVerificationEmail,
} from "../services/authenticationsServices.js";
import { notify } from "../utils/notify";

const Register = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const [sentUserData, setSentUserData] = useState({});
  const [isRegistered, setIsRegistered] = useState(false);
  const [timer, setTimer] = useState(30); // 3 minutes in seconds
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [isLoading, setLoading] = useState(false); // New loading state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const response = await register(formData);
      if (response?.data?.success) {
        notify(response?.data?.message, "success");
        setIsRegistered(true);
        setSentUserData({ ...formData });
        setFormData({ fullname: "", email: "", password: "" });
        // Start the timer
        startTimer(); // for resend email
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        notify(error.response.data.message, "failure");
      } else {
        notify("An unexpected error occurred. Please try again.", "failure");
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const startTimer = () => {
    setIsResendDisabled(true);
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setIsResendDisabled(false);
          return 30; // Reset timer to 3 minutes for the next round
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    //%%%%%%%%%%%%later on%%%%%%%%%%%%%%%%%%
    //Here we will handle the resend verification link operation later on
    try {
      const res = await resendVerificationEmail(sentUserData);
      notify(res.message, "success");
    } catch (error) {
      console.log(error);
      notify(error.message, "failure");
    }
    setTimer(30);
    startTimer();
    setIsResendDisabled(true);
  };

  return (
    <div className="bg-cusLightBG dark:bg-cusDarkBG min-h-screen flex items-center justify-center p-4">
      <div className="bg-white dark:bg-cusLightDarkBG p-6 rounded-lg shadow-md w-full max-w-md">
        <ToastContainer />
        {!isRegistered ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-cusPrimaryColor dark:text-cusSecondaryLightColor">
              Register
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-cusPrimaryColor dark:text-cusSecondaryLightColor">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-cusDarkBG  text-cusPrimaryColor dark:text-cusSecondaryLightColor border-cusPrimaryColor dark:border-cusSecondaryColor focus:outline-none focus:ring-2 focus:ring-cusPrimaryColor"
                  placeholder="Enter your fullname"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-cusPrimaryColor dark:text-cusSecondaryLightColor">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-cusDarkBG  text-cusPrimaryColor dark:text-cusSecondaryLightColor border-cusPrimaryColor dark:border-cusSecondaryColor focus:outline-none focus:ring-2 focus:ring-cusPrimaryColor"
                  placeholder="Enter your email"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-cusPrimaryColor dark:text-cusSecondaryLightColor">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 border rounded dark:bg-cusDarkBG  text-cusPrimaryColor dark:text-cusSecondaryLightColor border-cusPrimaryColor dark:border-cusSecondaryColor focus:outline-none focus:ring-2 focus:ring-cusPrimaryColor"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                className="w-full p-2 bg-cusPrimaryColor text-white rounded hover:bg-opacity-90 dark:bg-cusSecondaryColor"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex justify-center items-center">
                    <span>Registering</span>
                    <div className="ml-2 flex space-x-1">
                      <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce-dot"></div>
                      <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce-dot delay-150"></div>
                      <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce-dot delay-300"></div>
                    </div>
                  </div>
                ) : (
                  "Register"
                )}
              </button>
            </form>

            <p className="text-sm mt-4 text-cusPrimaryColor dark:text-cusSecondaryLightColor">
              Already have an account?
              <Link
                to="/login"
                className="text-cusSecondaryColor dark:text-cusSecondaryLightColor ml-1 underline"
              >
                Login
              </Link>
            </p>
          </>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-cusPrimaryColor dark:text-cusSecondaryLightColor">
              Check Your Email
            </h2>
            <p className="text-cusPrimaryColor dark:text-cusSecondaryLightColor">
              We&apos;ve sent a verification link to your email. Please check
              your inbox and spam folder.
            </p>
            <button
              onClick={handleResend}
              disabled={isResendDisabled}
              className={`mt-4 p-2 ${
                isResendDisabled
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-cusPrimaryColor hover:bg-opacity-90 dark:bg-cusSecondaryColor"
              } text-white rounded`}
            >
              {isResendDisabled
                ? `Resend Link in ${Math.floor(timer / 60)}:${
                    timer % 60 < 10 ? `0${timer % 60}` : timer % 60
                  }`
                : "Resend Verification Link"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
