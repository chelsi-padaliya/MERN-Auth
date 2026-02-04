import { useState, useEffect } from "react";
import OTPInput from "./OTPInput";
import axios from "axios";

export default function VerifyOTP({ email, setPage, setOtp, mode }) {
  const [otpInput, setOtpInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [isExpired, setIsExpired] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsExpired(true);
    }
  }, [timeLeft]);

  const handleContinue = async () => {
    if (!otpInput || otpInput.length !== 4) {
      alert("Please enter complete 4-digit OTP");
      return;
    }

    if (isExpired) {
      alert("OTP has expired. Please request a new one.");
      return;
    }

    setLoading(true);
    setOtp(otpInput);

    if (mode === "forgot") {
      setPage("reset");
    } else {
      // Register flow - verify OTP with backend
      try {
        await axios.post("http://localhost:5000/api/auth/verify-otp", {
          email,
          otp: otpInput
        });
        alert("Email verified successfully!");
        setPage("login");
      } catch (error) {
        alert(error.response?.data?.message || "OTP verification failed");
      }
    }
    setLoading(false);
  };

  const resendOTP = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/send-otp", { email });
      setTimeLeft(60);
      setIsExpired(false);
      setOtpInput("");
      alert("New OTP sent!");
    } catch (error) {
      alert("Failed to resend OTP");
    }
  };

  return (
    <>
      <h2 className="text-3xl font-bold text-center mb-6 text-slate-800">
        OTP Verification
      </h2>

      <p className="text-sm text-center mb-8 text-slate-500 max-w-xs mx-auto">
        Enter the 4-digit OTP sent to your registered email or phone.
      </p>

      <OTPInput value={otpInput} onChange={setOtpInput} length={4} />

      <div className="text-center mb-4">
        {!isExpired ? (
          <p className="text-sm text-slate-600">
            Time remaining: <span className="font-bold text-green-600">{timeLeft}s</span>
          </p>
        ) : (
          <p className="text-sm text-red-600 font-semibold">OTP Expired</p>
        )}
      </div>

      <button
        type="button"
        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg mt-4 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
        onClick={handleContinue}
        disabled={loading || isExpired}
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>

      {isExpired && (
        <button
          type="button"
          className="w-full py-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
          onClick={resendOTP}
        >
          Resend OTP
        </button>
      )}
    </>
  );
}
