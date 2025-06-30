import React, { useEffect } from "react";
import "../styles/Loading.css";
import { MoonLoader } from "react-spinners";

const Loading = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="loaderOverlay" aria-live="polite">
      <MoonLoader
        color="hsla(214, 100%, 35%, 1)"
        size={60}
        speedMultiplier={0.6}
      />
    </div>
  );
};

export default Loading;
