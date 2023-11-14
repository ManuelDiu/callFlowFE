import styled from "styled-components";
import tw from "twin.macro";
import { GrClose } from "react-icons/gr";
import Button from "../../Buttons/Button";
import ErrorIcon from "@/public/icons/ErrorIcon.svg";
import WarningIcon from "@/public/icons/WarningIcon.svg";
import SuccessIcon from "@/public/icons/SuccessIcon.svg";
import Image from "next/image";

interface Props {
  title: string;
  setOpen: any;
  description?: string;
  content?: any;
  onSubmit?: any;
  onCancel?: any;
  textok: string;
  textcancel: string;
  variant: "green" | "yellow" | "red";
}

const Container = styled.div`
  ${tw`w-screen py-4 md:px-0 px-4 bg-black/50 min-h-screen h-full fixed z-[50000] left-0 top-0 flex max-h-full overflow-auto justify-center `}
`;

const ModalContainer = styled.div`
  ${tw`lg:w-[900px] overflow-hidden md:w-[700px] mt-[5%] w-full flex flex-col items-center justify-start gap-[20px] h-fit bg-white shadow-md rounded-2xl z-[2]`}
`;

const Content = styled.div`
  ${tw`w-full h-auto flex flex-col items-center justify-start gap-[20px] md:p-6 p-4`}
`;

const TitleContainer = styled.div`
  ${tw`w-full flex-grow h-auto flex items-center justify-between`}
`;

const Title = styled.span`
  ${tw`text-texto text-2xl font-bold`}
`;

const Row = styled.span`
  ${tw`w-full gap-4 h-auto flex flex-row items-center justify-start`}
`;

const IconContainer = styled.div`
  ${tw`w-[60px] min-w-[60px] h-[60px] relative`}
`;

const Description = styled.span`
  ${tw`text-textogris w-full text-left text-[14px] font-normal`}
`;

const BottomActionsContainer = styled.div`
  ${tw`w-full h-auto flex gap-2 flex-row items-center justify-end py-3 px-6 bg-buttonActionsModal`}
`;

const ModalConfirmation = ({
  title,
  setOpen,
  description,
  content,
  onSubmit,
  onCancel,
  textok,
  variant,
  textcancel,
  ...props
}: Props) => {
  const getIcon = () => {
    switch (variant) {
      case "green":
        return SuccessIcon?.src;
      case "red":
        return ErrorIcon?.src;
      case "yellow":
        return WarningIcon?.src;
    }
  };

  return (
    <Container data-testid="ModalConfirmation" className="modalOpen">
      <ModalContainer>
        <Content>
          <Row>
            <IconContainer>
              <Image
                src={getIcon()}
                loader={() => getIcon()}
                layout="fill"
                objectFit="cover"
              />
            </IconContainer>
            <TitleContainer>
              <Title>{title}</Title>
              <GrClose
                onClick={() => setOpen(false)}
                className="cursor-pointer"
                color="#A3AED0"
                size={20}
              />
            </TitleContainer>
          </Row>

          {description && <Description>{description}</Description>}
          {content && content}
        </Content>

        <BottomActionsContainer>
          <Button
            variant="gray"
            sizeVariant="auto"
            text={textcancel}
            action={() => onCancel && onCancel()}
          />
          <Button
            variant={variant}
            sizeVariant="auto"
            text={textok}
            action={() => onSubmit && onSubmit()}
          />
        </BottomActionsContainer>
      </ModalContainer>
    </Container>
  );
};

export default ModalConfirmation;
