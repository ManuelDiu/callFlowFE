import React, { MouseEventHandler } from "react";
import styled from "styled-components";
import tw from "twin.macro";

type ButtonVariant = "fill" | "outline" | "gray" | "green" | "yellow" | "red";

type SizeVariant = "auto" | "full" | "fit";

type RoundedVariant = "large" | "full";

type ButtonProps = {
  text?: string;
  action?: MouseEventHandler;
  type?: "submit" | "button";
  variant?: ButtonVariant;
  sizeVariant?: SizeVariant;
  className?: string;
  rounded?: RoundedVariant;
  icon?: any
  disabled?: boolean
  title?: string;
};

const ButtonVariants = {
  fill: tw`bg-principal active:bg-principal/80 border-transparent`,
  outline: tw`border-principal text-principal transition-all hover:bg-principal hover:text-white hover:border-transparent`,
  gray: tw`border-gray100 text-gray900 bg-white`,
  green: tw`bg-modalButtons-green text-white border-0 ring-0`,
  yellow: tw`bg-modalButtons-yellow text-white border-0 ring-0`,
  red: tw`bg-modalButtons-red text-white border-0 ring-0`,
};

const SizeVariants = {
  full: tw`w-full py-4 flex items-center justify-center`,
  auto: tw`w-auto text-center flex items-center justify-center py-4`,
  fit: tw`w-fit min-w-fit`,
};

const RoundedVariants = {
  large: tw`rounded-2xl`,
  full: tw`rounded-full`,
};


const ButtonComp = styled.button<{ variant: ButtonVariant; size: SizeVariant, rounded: RoundedVariant }>`
  ${tw`text-white transition-all text-sm border-2 font-bold px-4 py-[8px] shadow flex flex-row gap-x-2 items-center justify-start outline-none focus:outline-none ease-linear transition-all duration-150`}
  ${({ variant }) => ButtonVariants[variant]}
  ${({ size }) => SizeVariants[size]}
  ${({ rounded }) => RoundedVariants[rounded]}
`;

const Button = ({
  text,
  type = "button",
  action = () => null,
  variant = "fill",
  sizeVariant = "auto",
  className = "",
  rounded = "full",
  icon,
  disabled = false,
  title = "",
}: ButtonProps) => {
  return (
    <ButtonComp
      className={className}
      size={sizeVariant}
      variant={variant}
      type={type}
      onClick={action}
      rounded={rounded}
      disabled={disabled}
      title={title}
    >
      {icon && icon}
      {text}
    </ButtonComp>
  );
};

export default Button;
