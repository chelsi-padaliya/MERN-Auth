import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Login from "../components/Login";
import Register from "../components/Register";
import ForgotPassword from "../components/ForgotPassword";
import VerifyOTP from "../components/VerifyOTP";
import ResetPassword from "../components/ResetPassword";

const slideVariants = {
  initial: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
  exit: (direction) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: "easeInOut",
    },
  }),
};

export default function AuthPage() {
  const [page, setPage] = useState("login");
  const [direction, setDirection] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [mode, setMode] = useState("");

  const changePage = (next) => {
    setDirection(next === "register" ? 1 : -1);
    setPage(next);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="bg-white/90 backdrop-blur-sm w-[400px] rounded-2xl shadow-xl border border-white/20 overflow-hidden p-8">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={slideVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {page === "login" && (
              <Login setPage={changePage} setEmail={setEmail} />
            )}

            {page === "register" && (
              <Register
                setPage={changePage}
                setEmail={setEmail}
                setMode={setMode}
              />
            )}

            {page === "forgot" && (
              <ForgotPassword
                setPage={changePage}
                setEmail={setEmail}
                setMode={setMode}
              />
            )}

            {page === "verify" && (
              <VerifyOTP
                email={email}
                setPage={changePage}
                setOtp={setOtp}
                mode={mode}
              />
            )}

            {page === "reset" && (
              <ResetPassword email={email} otp={otp} setPage={changePage} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
