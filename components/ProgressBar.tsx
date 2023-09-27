import React from "react";

interface ProgressBarProps {
    progress: number;
    height?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, height = 8 }) => {
  return (
    <div
      style={{ height: `${height}px` }}
      className="rounded-md w-full h-2 bg-slate-300"
    >
      <div
        style={{ width: `${progress}%`, height: `${height}px` }}
        className={`rounded-md h-2 ${
          progress ? "bg-principal" : "bg-red-600"
        }`}
      ></div>
    </div>
  );
};

export default ProgressBar;
