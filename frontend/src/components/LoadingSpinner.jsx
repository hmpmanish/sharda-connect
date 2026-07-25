import { motion } from 'framer-motion';

const LoadingSpinner = ({ fullScreen = true }) => {
  const containerClass = fullScreen 
    ? "min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900" 
    : "flex items-center justify-center p-8";

  return (
    <div className={containerClass}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full"
      />
    </div>
  );
};

export default LoadingSpinner;
