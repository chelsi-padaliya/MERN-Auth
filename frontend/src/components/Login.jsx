import { useState } from "react";
import api from "../services/api";
import LoadingButton from "./LoadingButton";

export default function Login({ setPage, setEmail }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/login", form);

      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch (error) {
      const msg = error?.response?.data?.message || "Login failed";
      alert(msg);

      if (msg.toLowerCase().includes("verify")) {
        setEmail(form.email);
        setPage("verify");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-center mb-6 text-slate-800">
        Welcome Back
      </h2>

      <input
        className="input"
        placeholder="Email"
        value={form.email}
        disabled={loading}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        className="input"
        type="password"
        placeholder="Password"
        value={form.password}
        disabled={loading}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <LoadingButton loading={loading} text="Login" onClick={submit} />

      <p className="text-sm text-center mt-4 text-slate-600">
        <span className="link" onClick={() => setPage("forgot")}>
          Forgot password?
        </span>
      </p>

      <p className="text-sm text-center mt-2 text-slate-600">
        Don’t have an account?{" "}
        <span className="link" onClick={() => setPage("register")}>
          Sign up
        </span>
      </p>
    </>
  );
}
