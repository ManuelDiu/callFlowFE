import Image from "next/image";
import styled from "styled-components";
import tw from "twin.macro";
import { SlOptionsVertical } from "react-icons/sl";
import { useState } from "react";
import { OptionsItem } from "@/utils/utils";
import { DEFAULT_USER_IMAGE } from "@/utils/userUtils";
import Link from "next/link";
import appRoutes from "@/routes/appRoutes";
import Button from "@/components/Buttons/Button";
import { TbArrowsExchange } from "react-icons/tb";
import { useRouter } from "next/router";
import { EstadoData, EtapaPostulante } from "types/postulante";
import { EstadoPostulanteEnum } from "@/enums/EstadoPostulanteEnum";

interface Props {
  userName?: string;
  userlastName?: string;
  userImage: string | undefined;
  className?: string;
  withDot?: boolean;
  label?: any;
  options?: OptionsItem[];
  showCurrEtapa?: boolean;
  llamadoId?: number;
  postulanteId?: number;
  etapaActual?: EtapaPostulante;
}

const Container = styled.div`
  ${tw`w-full h-auto max-w-full overflow-visible flex flex-row items-center justify-start gap-1`}
`;

const ImageContainer = styled.div`
  ${tw`relative min-w-[50px] w-[50px] h-[50px] rounded-full flex items-center justify-center overflow-hidden`}
`;

const Content = styled.p`
  ${tw`flex w-full justify-between h-auto`}
`;

const TextContainer = styled.a`
  ${tw`flex-grow h-auto flex flex-col items-start mt-[2px] overflow-hidden justify-center cursor-pointer`}
`;

const ActionsContainer = styled.div`
  ${tw`h-auto flex flex-row  items-center justify-between gap-8 flex-wrap`}
`;

const Name = styled.span`
  ${tw`text-[18px] text-texto font-bold leading-[16px] max-w-full w-full truncate overflow-hidden`}
`;

const LastName = styled.span`
  ${tw`text-[14px] text-textogris font-bold max-w-full truncate overflow-hidden`}
`;

const DotContainer = styled.button`
  ${tw`w-auto h-auto relative`}
`;

const OptionsContainer = styled.div`
  ${tw`w-[250px] bg-white absolute right-0 p-4 rounded-lg top-full shadow-md border border-textogris h-auto flex flex-col items-center justify-start gap-1`}
`;

const OptionLabel = styled.p`
  ${tw`w-full h-auto flex font-semibold flex-row text-texto items-center justify-start px-2 py-1  transition-all rounded-lg`}
`;

const BubbleContainer = styled.div`
  ${tw`w-fit h-auto px-2 flex py-[2px] flex-row items-center gap-[4px] py-0 rounded-[6px] shadow-sm max-w-full overflow-hidden bg-red-400`}
`;

const LabelContainer = styled.div`
  ${tw`w-fit h-auto px-2 flex py-[2px] flex-row items-center gap-[4px] py-0 rounded-[6px] shadow-sm max-w-full `}
`;

const Bubble = styled.div`
  ${tw`rounded-full bg-white w-[6px] h-[6px]`}
`;

const Text = styled.span`
  ${tw`text-white font-normal text-[14px] max-w-full overflow-hidden truncate`}
`;

const PostulanteInfoLine = ({
  userImage,
  userName,
  userlastName,
  className,
  withDot = false,
  options,
  llamadoId,
  postulanteId,
  showCurrEtapa = false,
  etapaActual,
  label,
}: Props) => {
  const [openOptions, setOpenOptions] = useState(false);
  const { push } = useRouter();

  const getColor = () => {
    switch (label) {
      case EstadoPostulanteEnum.cumpleRequisito:
        return "#48D656";
      case EstadoPostulanteEnum.noCumpleRequisito:
        return "#DC2626";
      case EstadoPostulanteEnum.enDua:
        return "#DCE01E";
    }
  };

  return (
    <Container className={className}>
      <ImageContainer>
        <img
          className="w-full h-full rounded-full object-fill"
          src={
            userImage !== "" && userImage !== null
              ? userImage
              : DEFAULT_USER_IMAGE
          }
        />
      </ImageContainer>
      <Content>
        <Link href={appRoutes.postulanteInLlamadoInfo(llamadoId, postulanteId)}>
          <TextContainer>
            <Name>{userName}</Name>
            <LastName>{userlastName}</LastName>
          </TextContainer>
        </Link>
        {showCurrEtapa && (
          <ActionsContainer>
            <BubbleContainer>
              <Bubble></Bubble>
              <Text>{etapaActual?.nombre}</Text>
            </BubbleContainer>
            <Button
              icon={<TbArrowsExchange color="#4318FF" size={18} />}
              variant="outline"
              text="Modificar Puntajes"
              className="!z-[20]"
              action={() =>
                push(
                  appRoutes.completarGrillaPostulante(llamadoId, postulanteId)
                )
              }
            />
          </ActionsContainer>
        )}
        {label && (
          <ActionsContainer>
            <LabelContainer style={{ background: getColor() }}>
              <Bubble></Bubble>
              <Text>{label}</Text>
            </LabelContainer>
          </ActionsContainer>
        )}
      </Content>
      {withDot && (
        <DotContainer>
          {openOptions && (
            <OptionsContainer className="modalOpen">
              {options?.map((opt, index) => {
                return (
                  <OptionLabel
                    className="transition-all bg-transparent hover:bg-slate-100"
                    key={`opt-${index}`}
                    onClick={() => opt?.onClick && opt?.onClick()}
                  >
                    {opt?.text}
                  </OptionLabel>
                );
              })}
            </OptionsContainer>
          )}
          <SlOptionsVertical
            onClick={() => setOpenOptions(!openOptions)}
            color="#A3AED0"
            size={20}
          />
        </DotContainer>
      )}
    </Container>
  );
};

export default PostulanteInfoLine;
