import React, { MouseEventHandler } from "react";
import styled from "styled-components";
import tw from "twin.macro";

type ButtonProps = {
  text?: string;
  action?: MouseEventHandler;
};

/* type ContainerVariant = 'normal' | 'checkbox'

interface ContainerProps {
  variant?: ContainerVariant
}

const containerVariants: Record<ContainerVariant, TwStyle> = {
  // Named class sets
  normal: tw`bg-black text-white`,
  checkbox: tw`bg-yellow-500 text-red-500`,
}

const StyledInput = styled.section<ContainerProps>(() => [
  // Return a function here
  tw`flex w-full`,
  ({ variant = 'normal' }) => containerVariants[variant], // Grab the variant style via a prop
]) */

const Button = ({ text, action=()=>null }: ButtonProps) => {
  return (
    <div className="flex flex-col w-full">
      <button
        className="bg-principal text-white active:bg-principal/80 font-bold px-6 py-3 rounded-2xl shadow hover:shadow-lg outline-none focus:outline-none w-full ease-linear transition-all duration-150"
        type="submit"
        onClick={action}
      >{text}</button>
    </div>
  );
};

export default Button;
