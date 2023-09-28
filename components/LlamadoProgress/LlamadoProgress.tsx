import styled from "styled-components";
import tw from "twin.macro";

const Container = styled.div`
  ${tw`w-full h-[4px] flex items-center overflow-hidden justify-start rounded-full bg-grisBgIndicator`}
`;

const ProgressIndicator = styled.div`
  ${tw`h-full bg-principal rounded-full`}
`;

interface Props {
  progress?: number;
}

const LlamadoProgress = ({ progress = 0 }: Props) => {
  console.log("progress", progress)

  return (
    <Container>
      <ProgressIndicator style={{ width: `${progress}%` }}/>
    </Container>
  );
};

export default LlamadoProgress;
