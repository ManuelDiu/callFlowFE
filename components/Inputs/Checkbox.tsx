import React, { useState } from "react";
import styled from "styled-components";
import tw from 'twin.macro'

const generarId = () => `chkbx-${Math.random().toString(36).substring(2, 15)}`;

type CheckboxProps = {
  label?: string;
//   variante?: ContainerVariant;
};

/* type ContainerVariant = 'normal' | 'checkbox'

interface ContainerProps {
  variant?: ContainerVariant
}

const containerVariants = {
  normal: tw`bg-red-500 text-white`,
  checkbox: tw`bg-yellow-500 text-red-500`,
} */

const Checkbox = ({ label }: CheckboxProps) => {
    const id = generarId();
    const [checked, setChecked] = useState(false);

    const toggleChecked = () => {
      setChecked(!checked);
    };

    return (
        <div className="flex items-center">
      <div
        className={`w-6 cursor-pointer h-6 border-2 border-gray-400 rounded-md mr-2 ${
            checked ? 'bg-principal border-principal' : ''
        } transition-all duration-300 ease-in-out`}
        onClick={toggleChecked}
        id={id}
      >
        {checked && (
          <svg
            className={`w-4 h-4 mx-auto mt-0.5 fill-current text-white ${
              checked ? 'opacity-100' : 'opacity-0'
            } transition-opacity duration-300 ease-in-out`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
          </svg>
        )}
      </div>
      <label className="text-gray-700 cursor-pointer select-none" onClick={toggleChecked}>
        {label}
      </label>
    </div>
      );
  };

export default Checkbox;
