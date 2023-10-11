import styled from "styled-components";
import tw from "twin.macro";
import { BsPlusCircleFill } from "react-icons/bs";
import { OptionsItem } from "@/utils/utils";
import PostulanteInfoLine from "../Table/components/PostulanteInfoLine";
import { PostulanteLlamadoResumed } from "types/postulante";
import { DEFAULT_USER_IMAGE } from "@/utils/userUtils";

interface Props {
  title: string;
  selectedUsers: any[];
  onAddClick?: any;
  onRemove?: any;
  showCurrEtapa?: boolean;
  llamadoId: number;
  postulantesLlamadoFound?: PostulanteLlamadoResumed[];
}

const Container = styled.div`
  ${tw`w-full h-auto flex flex-col bg-white items-center justify-start gap-4 p-5 shadow-md rounded-2xl`}
`;

const Row = styled.div`
  ${tw`w-full flex flex-row items-center justify-between`}
`;

const PlusContainer = styled.button`
  ${tw`bg-principalLight border-none rounded-[10px] p-[8px] flex items-center justify-center`}
`;

const Title = styled.span`
  ${tw`text-lg font-semibold text-texto`}
`;

const ListOfPostulantes = ({
  title,
  selectedUsers,
  onAddClick,
  onRemove,
  llamadoId,
  showCurrEtapa = false,
  postulantesLlamadoFound,
}: Props) => {
  return (
    <Container>
      <Row>
        <Title>{title}</Title>
        {onAddClick && (
          <PlusContainer onClick={() => onAddClick()}>
            <BsPlusCircleFill size={26} color="#4318FF" />
          </PlusContainer>
        )}
      </Row>
      {!postulantesLlamadoFound
        ? selectedUsers?.map((item, index) => {
            const optionsToItem: OptionsItem[] = [
              {
                text: "Eliminar",
                onClick: () => onRemove(item),
              },
            ];

            return (
              <PostulanteInfoLine
                className="shadow-md w-full rounded-2xl p-4"
                key={`userInfoLine-${index}`}
                userImage={item?.imageUrl}
                userName={item?.name}
                userlastName={item?.lastName}
                llamadoId={llamadoId}
                postulanteId={item?.id}
                withDot={onRemove !== undefined && onRemove !== null}
                options={optionsToItem}
                showCurrEtapa={showCurrEtapa}
              />
            );
          })
        : postulantesLlamadoFound?.map((item, index) => {
            const optionsToItem: OptionsItem[] = [
              {
                text: "Eliminar",
                onClick: () => onRemove(item),
              },
            ];

            return (
              <PostulanteInfoLine
                className="shadow-md w-full rounded-2xl p-4"
                key={`userInfoLine-${index}`}
                userImage={DEFAULT_USER_IMAGE}
                userName={item?.postulante?.nombres}
                userlastName={item?.postulante?.apellidos}
                llamadoId={llamadoId}
                postulanteId={item?.postulante?.id}
                etapaActual={item?.etapa}
                withDot={onRemove !== undefined && onRemove !== null}
                options={optionsToItem}
                showCurrEtapa={showCurrEtapa}
              />
            );
          })}
    </Container>
  );
};

export default ListOfPostulantes;
