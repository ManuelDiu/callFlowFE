import styled from "styled-components";
import tw from "twin.macro";

interface Props {
  text?: string;
  className?: string,
}

const TextContent = styled.span`
  ${tw`text-texto text-xs font-semibold max-w-full truncate overflow-hidden`}
`;

const Text = ({ text, className }: Props) => {
  return <TextContent className={className}>{text || "Vacio"}</TextContent>;
};

export default Text;
