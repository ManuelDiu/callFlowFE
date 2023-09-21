import React, { HTMLInputTypeAttribute } from "react";
import styled from "styled-components";
import tw from 'twin.macro'

import {UseFormRegister, FieldValues, RegisterOptions } from 'react-hook-form'

const generarId = () => `input-${Math.random().toString(36).substring(2, 15)}`;

type InputProps = {
  label?: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  required?: boolean;
  variante?: ContainerVariant;
  register?: Function;
  inputFormName?: string;
  autoComplete?: string;
};

type ContainerVariant = 'normal' | 'checkbox'

interface ContainerProps {
  variant?: ContainerVariant
}

const containerVariants = {
  normal: tw`bg-white text-black`,
  checkbox: tw`bg-yellow-500 text-red-500`,
}

const StyledInput = styled.input<ContainerProps>(() => [
  tw`border rounded-2xl px-5 py-4 w-full transition-all ring-2 ring-transparent outline-none ring-principal placeholder-textogris border-textogris bg-white`,
  ({ variant = 'normal' }) => containerVariants[variant], // Grab the variant style via a prop
])

const Input = ({ label, placeholder, type = 'text', required = false, register=()=>null, inputFormName, autoComplete = 'off', ...otros }: InputProps) => {
    const id = generarId();

    return (
      <div className="flex flex-col w-full">
        {label && (
          <label htmlFor={id} className="text-md font-medium text-texto select-none">
            {label}{required && <span className="text-principal">*</span>}
          </label>
        )}
        <StyledInput
          id={id}
          className="focus:ring-textogris"
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          {...register(inputFormName)}
          {...otros}
        />
      </div>
    );
  };

export default Input;
