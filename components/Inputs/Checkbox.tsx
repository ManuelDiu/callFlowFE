import React, { useEffect, useState } from "react";
import styled from "styled-components";
import tw from "twin.macro";

const generarId = () => `chkbx-${Math.random().toString(36).substring(2, 15)}`;

type CheckboxProps = {
  label?: string;
  setValue?: any;
  helperText?: string;
  value?: any;
  disabled?: boolean;
  defaultChecked?: boolean;
};

const Checkbox = ({
  label,
  setValue,
  helperText,
  value,
  disabled = false,
  defaultChecked = false,
}: CheckboxProps) => {
  const id = generarId();
  const [checked, setChecked] = useState(defaultChecked);

  useEffect(() => {
    if (value) {
      setChecked(value === true);
    }
  }, [value]);

  const toggleChecked = () => {
    if (!disabled) {
      setChecked(!checked);
      if (setValue) {
        setValue(!checked);
      }
    }
  };

  return (
    <div className="w-full transition-all flex flex-col items-start justify-start gap-1">
      <div className="flex items-center">
        <div
          className={`w-6 cursor-pointer h-6 border-2 border-gray-400 rounded-md mr-2 ${
            checked ? "bg-principal border-principal" : ""
          } transition-all duration-300 ease-in-out`}
          onClick={toggleChecked}
          id={id}
        >
          {checked && (
            <svg
              className={`w-[13px] h-[15px] mx-auto mt-0.5 fill-current text-white ${
                checked ? "opacity-100" : "opacity-0"
              } transition-opacity duration-300 ease-in-out`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
            </svg>
          )}
        </div>
        <label
          className="text-gray-700 cursor-pointer select-none"
          onClick={toggleChecked}
        >
          {label}
        </label>
      </div>
      {helperText && (
        <span className="text-xs font-medium text-smallGray">{helperText}</span>
      )}
    </div>
  );
};

export default Checkbox;
