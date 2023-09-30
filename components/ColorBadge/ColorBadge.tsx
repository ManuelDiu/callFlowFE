import styled from "styled-components";
import tw from "twin.macro";

const Container = styled.div`
  ${tw`w-full h-auto shadow-md rounded-full h-[30px] min-h-[30px]`}
`;

interface Props {
  color: string;
  className?: string,
}

const ColorBadge = ({ color, className }: Props) => {
  return <Container className={className} style={{ backgroundColor: color }} />;
};

export default ColorBadge;
