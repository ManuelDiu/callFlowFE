import React, { HTMLInputTypeAttribute } from "react";
import styled from "styled-components";
import tw from "twin.macro";

import { UseFormRegister, FieldValues, RegisterOptions } from "react-hook-form";

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
  className?: string;
  isInvalid?: boolean;
  disabled?: boolean;
};

type ContainerVariant = "normal" | "checkbox" | "textarea";

interface ContainerProps {
  variant?: ContainerVariant;
  isInvalid?: boolean;
}

const containerVariants = {
  normal: tw`bg-white text-black`,
  checkbox: tw`bg-yellow-500 text-red-500`,
  textarea: tw``,
};

const StyledTextArea = styled.textarea<ContainerProps>(() => [
  tw`border-[2px] rounded-2xl px-5 min-h-[120px] max-h-[120px] h-[120px] py-4 w-full transition-all ring-2 ring-transparent outline-none ring-principal placeholder-textogris bg-white`,
  ({ isInvalid }) => (isInvalid ? tw`border-red2` : "border-textogris"),
]);

const StyledInput = styled.input<ContainerProps>(() => [
  tw`border-[2px] rounded-2xl px-5 py-4 w-full transition-all ring-2 ring-transparent outline-none placeholder-textogris bg-white`,
  ({ variant = "normal" }) => containerVariants[variant], // Gr
  ({ isInvalid }) => (isInvalid ? tw`ring-1 ring-red2` : "ring-transparent"),
]);

const Input = ({
  label,
  placeholder,
  type = "text",
  required = false,
  register = () => null,
  inputFormName,
  isInvalid,
  autoComplete = "off",
  variante,
  disabled = false,
  ...otros
}: InputProps) => {
  const id = generarId();

  return (
    <div className="flex flex-col w-full">
      {label && (
        <label
          htmlFor={id}
          className="text-md font-medium text-texto select-none"
        >
          {label}
          {required && <span className="text-principal">*</span>}
        </label>
      )}
      {variante === "textarea" ? (
        <StyledTextArea
          disabled={disabled}
          id={id}
          className="focus:ring-textogris focus:border-transparent disabled:opacity-50"
          type={type}
          isInvalid={isInvalid}
          placeholder={placeholder}
          autoComplete={autoComplete}
          {...register(inputFormName)}
          {...otros}
        />
      ) : (
        <StyledInput
          disabled={disabled}
          id={id}
          className="focus:ring-textogris focus:border-transparent disabled:opacity-50"
          type={type}
          isInvalid={isInvalid}
          placeholder={placeholder}
          autoComplete={autoComplete}
          {...register(inputFormName)}
          {...otros}
        />
      )}
    </div>
  );
};

export default Input;
