import { useEffect, useState } from "react";

const Loader = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length === 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center h-screen text-3xl font-bold text-blue-600">
      Academy{dots}
    </div>
  );
};

export default Loader;