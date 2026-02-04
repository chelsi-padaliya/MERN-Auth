import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5000/api/auth/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data.user))
      .catch(() => alert("Session expired"));
  }, []);

  if (!user) return <p className="p-10">Loading...</p>;  

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6 space-y-6">
        <h2 className="text-2xl font-bold">Auth System</h2>
        <nav className="space-y-3 text-gray-300">
          <p className="hover:text-white cursor-pointer">Dashboard</p>
          <p className="hover:text-white cursor-pointer">Profile</p>
          <p className="hover:text-white cursor-pointer">Settings</p>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-semibold mb-6">
          Welcome, {user.email.split("@")[0]}
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Email</p>
            <p className="font-semibold">{user.email}</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">User ID</p>
            <p className="font-semibold truncate">{user._id}</p>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
