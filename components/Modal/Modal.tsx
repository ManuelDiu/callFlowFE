import styled from "styled-components";
import tw from "twin.macro";
import { GrClose } from "react-icons/gr";
import Button from "../Buttons/Button";
import clsx from "clsx";

interface Props {
  title: string;
  setOpen: any;
  description?: string;
  content?: any;
  bottomActiosn?: boolean;
  onSubmit?: any;
  onCancel?: any;
  textok: string,
  textcancel?: string,
  modalClassname?: string;
  className?: string,
}

const Container = styled.div`
  ${tw`w-screen py-4 md:px-0 px-4 bg-black/50 min-h-screen h-full fixed z-[50000] left-0 top-0 flex max-h-full overflow-auto justify-center `}
`;

const ModalContainer = styled.div`
  ${tw`lg:w-[900px] overflow-visible md:w-[700px] mt-[5%] w-full flex flex-col items-center justify-start gap-[20px] h-fit bg-white shadow-md rounded-2xl z-[2]`}
`;

const Content = styled.div`
  ${tw`w-full h-auto flex flex-col items-center justify-start gap-[20px] md:p-6 p-4`}
`;

const TitleContainer = styled.div`
  ${tw`w-full h-auto flex items-center justify-between`}
`;

const Title = styled.span`
  ${tw`text-texto text-[28px] font-bold`}
`;

const Description = styled.span`
  ${tw`text-textogris w-full text-left text-[14px] font-normal`}
`;

const BottomActionsContainer = styled.div`
  ${tw`w-full h-auto flex gap-2 flex-row items-center justify-end py-3 px-6 bg-buttonActionsModal`}
`;

const Modal = ({
  title,
  setOpen,
  description,
  content,
  onSubmit,
  onCancel,
  bottomActiosn = true,
  textok,
  textcancel,
  className,
  modalClassname,
}: Props) => {

    return (
    <Container className={clsx("modalOpen")}>
      <ModalContainer className={className}>
        <Content>
          <TitleContainer>
            <Title>{title}</Title>
            <GrClose
              onClick={() => setOpen(false)}
              className="cursor-pointer"
              color="#A3AED0"
              size={20}
            />
          </TitleContainer>
          {description && <Description>{description}</Description>}
          {content && content}
        </Content>

        {bottomActiosn && (
          <BottomActionsContainer>
            {textcancel && <Button
              variant="gray"
              sizeVariant="auto"
              text={textcancel}
              action={() => onCancel && onCancel()}
            />}
            <Button
              variant="fill"
              sizeVariant="auto"
              text={textok}
              action={() => onSubmit && onSubmit()}
            />
          </BottomActionsContainer>
        )}
      </ModalContainer>
    </Container>
  );
};

export default Modal;
