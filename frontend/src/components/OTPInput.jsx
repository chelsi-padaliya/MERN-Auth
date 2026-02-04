import { useState, useRef, useEffect } from "react";

export default function OTPInput({ value, onChange, length = 4 }) {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.value !== "" && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        inputRefs.current[index - 1].focus();
      }
      setOtp([...otp.map((d, idx) => (idx === index ? "" : d))]);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").slice(0, length);
    const pasteArray = pasteData.split("").filter(char => !isNaN(char));

    if (pasteArray.length === length) {
      setOtp(pasteArray);
      inputRefs.current[length - 1].focus();
    }
  };

  useEffect(() => {
    onChange(otp.join(""));
  }, [otp, onChange]);

  return (
    <div className="flex justify-center gap-3 mb-6">
      {otp.map((data, index) => (
        <input
          key={index}
          type="text"
          maxLength="1"
          value={data}
          ref={(el) => (inputRefs.current[index] = el)}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className="w-12 h-12 text-center text-xl font-bold border border-slate-300 rounded-md focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none transition-all bg-white text-slate-700 shadow-sm"
        />
      ))}
    </div>
  );
}