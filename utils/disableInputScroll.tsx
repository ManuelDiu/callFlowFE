import { useEffect } from "react";

const DisableNumberInputScroll = () => {
  useEffect(() => {
    const handleMouseWheel = (event: any) => {
      const target = event.target;

      if (target.type === "number") {
        event.preventDefault();
      }
    };

    document.addEventListener("wheel", handleMouseWheel, { passive: false });

    return () => {
      document.removeEventListener("wheel", handleMouseWheel);
    };
  }, []);

  return null;
};

export default DisableNumberInputScroll;
