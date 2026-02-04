import { motion } from "framer-motion";

export default function Spinner({ size = 20 }) {
  return (
    <motion.div
      className="border-2 border-white border-t-transparent rounded-full"
      style={{ width: size, height: size }}
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        duration: 1,
        ease: "linear",
      }}
    />
  );
}
