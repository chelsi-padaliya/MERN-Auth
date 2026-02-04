import { motion } from "framer-motion";
import Spinner from "./Spinner";

export default function LoadingButton({
  loading,
  text,
  onClick,
  type = "button",
}) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={loading}
      whileTap={{ scale: 0.98 }}
      whileHover={{ scale: loading ? 1 : 1.02 }}
      className="btn"
    >
      {loading ? (
        <div className="flex items-center justify-center gap-3">
          <Spinner size={20} />
          <span>Processing...</span>
        </div>
      ) : (
        text
      )}
    </motion.button>
  );
}
