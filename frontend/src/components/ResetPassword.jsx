import { useState } from "react";
import api from "../services/api";

export default function ResetPassword({ email, otp, setPage }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const resetPassword = async () => {
    try {
      // basic validation
      if (!password || !confirmPassword) {
        alert("Please fill all fields");
        return;
      }

      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      if (!otp) {
        alert("OTP missing. Please restart reset process.");
        setPage("forgot");
        return;
      }

      setLoading(true);

      await api.post("/reset-password", {
        email,
        otp, // 🔐 REQUIRED by backend
        newPassword: password,
      });

      alert("Password reset successful");

      // redirect to login
      setPage("login");
    } catch (error) {
      alert(error?.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-center mb-6 text-slate-800">
        New Password
      </h2>

      <p className="text-sm text-center text-slate-600 mb-4">
        Reset password for <b>{email}</b>
      </p>

      <input
        className="input"
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <input
        className="input"
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      <button
        type="button"
        className="btn"
        onClick={resetPassword}
        disabled={loading}
      >
        {loading ? "Resetting..." : "Reset Password"}
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
