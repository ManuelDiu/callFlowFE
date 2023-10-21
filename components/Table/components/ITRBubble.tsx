import { ITR } from "@/enums/ITR";
import styled from "styled-components";
import tw from "twin.macro";

interface Props {
  itr: ITR;
}

const Container = styled.div`
  ${tw`flex flex-row items-center justify-start gap-2`}
`;

const Text = styled.span`
  ${tw`font-bold text-sm text-texto`}
`;

const Bubble = styled.span`
  ${tw`w-[10px] h-[10px] rounded-full overflow-hidden`}
`;

const ITRBubble = ({ itr }: Props) => {
  const getBackgroundColor = () => {
    switch (itr) {
      case ITR.centrosur:
        return "#FF6A6A";
      case ITR.este:
        return "#6AEDFF";
      case ITR.norte:
        return "#4ED738";
      case ITR.suroeste:
        return "#943232";
      case ITR.ulo:
        return "#859854";
    }
  };

  return (
    <Container>
      <Bubble style={{ backgroundColor: getBackgroundColor() }}></Bubble>
      <Text>{itr?.replace("_", " ")}</Text>
    </Container>
  );
};

export default ITRBubble;
