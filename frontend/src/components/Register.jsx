import { useState } from "react";
import api from "../services/api";
import LoadingButton from "./LoadingButton";

export default function Register({ setPage, setEmail, setMode }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.name || !form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await api.post("/register", form);

      setEmail(form.email);
      setMode("register");

      await api.post("/send-otp", { email: form.email });

      alert("OTP sent to your email");
      setPage("verify");
    } catch (error) {
      alert(error?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-center mb-6 text-slate-800">
        Create Account
      </h2>

      <input
        className="input"
        placeholder="Name"
        disabled={loading}
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        className="input"
        placeholder="Email"
        disabled={loading}
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        className="input"
        type="password"
        placeholder="Password"
        disabled={loading}
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <LoadingButton loading={loading} text="Create Account" onClick={submit} />

      <p className="text-sm text-center mt-4 text-slate-600">
        Already have an account?{" "}
        <span className="link" onClick={() => setPage("login")}>
          Sign in
        </span>
      </p>
    </>
  );
}
