import { useState } from "react";
import api from "../services/api";

export default function ForgotPassword({ setPage, setEmail, setMode }) {
  const [emailInput, setEmailInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    try {
      await api.post("/send-otp", { email: emailInput });

      setEmail(emailInput);
      setMode("forgot");
      setPage("verify");
    } catch (error) {
      alert("Failed to send OTP");
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-center mb-6 text-slate-800">
        Reset Password
      </h2>

      <p className="text-sm text-center text-slate-600 mb-4">
        Enter your registered email
      </p>

      <input
        className="input"
        placeholder="Email"
        value={emailInput}
        onChange={(e) => setEmailInput(e.target.value)}
      />

      <button
        type="button"
        className="btn"
        onClick={sendOtp}
        disabled={loading}
      >
        {loading ? "Sending..." : "Send OTP"}
      </button>

      <p className="text-sm text-center mt-4 text-slate-600">
        Back to{" "}
        <span className="link" onClick={() => setPage("login")}>
          Sign in
        </span>
      </p>
    </>
  );
}
