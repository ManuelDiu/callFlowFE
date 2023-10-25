import styled from "styled-components";
import tw from "twin.macro";
import NotFoundImage from "@/public/images/NotFound.svg";
import Text from "../Table/components/Text";

const Container = styled.div`
  ${tw`w-full h-full flex flex-col items-center justify-center gap-4`}
`;

const NotFoundPage = () => {
  return (
    <Container>
      <img src={NotFoundImage?.src} className="object-cover h-[400px] w-auto" />
      <Text className="!text-[30px] !leading-[34px]" text="Oops!... No encontramos esta pagina" />
    </Container>
  );
};

export default NotFoundPage;
