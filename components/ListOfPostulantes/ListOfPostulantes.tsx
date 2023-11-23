import styled from "styled-components";
import tw from "twin.macro";
import { BsPlusCircleFill } from "react-icons/bs";
import { OptionsItem } from "@/utils/utils";
import PostulanteInfoLine from "../Table/components/PostulanteInfoLine";
import { PostulanteLlamadoResumed } from "types/postulante";
import { DEFAULT_USER_IMAGE } from "@/utils/userUtils";
import Input from "../Inputs/Input";
import { ChangeEvent, useEffect, useState } from "react";
import NotFoundImage from "@/public/images/NotFound.svg";
import Text from "../Table/components/Text";
import { useGlobal } from "@/hooks/useGlobal";
import { Roles } from "@/enums/Roles";
import { getLlamadoInfoById } from "@/controllers/llamadoController";
import { useQuery } from "@apollo/client";
import { FullLlamadoInfo } from "types/llamado";

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
  ${tw`w-full flex flex-col sm:flex-row items-center justify-between`}
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
  const [query, setQuery] = useState<string>("");
  const queryNotEmpty = query !== "" && query;
  const { userInfo, isAdmin, handleSetLoading } = useGlobal();

  const { data: llamaodData, loading: loadingLlamadoInfo } = useQuery<{
    getLlamadoById?: FullLlamadoInfo;
  }>(getLlamadoInfoById, {
    variables: {
      llamadoId: llamadoId,
    },
  });
  const fullLlamadoInfo = llamaodData?.getLlamadoById;

  useEffect(() => {
    handleSetLoading(loadingLlamadoInfo);
  }, [loadingLlamadoInfo]);

  const soyTribunal = fullLlamadoInfo?.miembrosTribunal?.find((item) => {
    return item.usuario.id === userInfo?.id;
  }) !== undefined;

  const filteredPostulantes =
    queryNotEmpty && postulantesLlamadoFound
      ? [
          ...postulantesLlamadoFound.filter(
            (postulante) =>
              postulante.postulante?.nombres
                ?.toLowerCase()
                .includes(query.toLowerCase()) ||
              postulante.postulante?.apellidos
                ?.toLowerCase()
                .includes(query.toLowerCase()) ||
              postulante.postulante?.documento?.includes(query)
          ),
        ]
      : postulantesLlamadoFound;

  const filteredUsers = queryNotEmpty
    ? [
        ...selectedUsers?.filter(
          (user) =>
            user?.name?.toLowerCase().includes(query?.toLowerCase()) ||
            user.lastName?.toLowerCase().includes(query.toLowerCase()) ||
            user?.documento?.includes(query)
        ),
      ]
    : selectedUsers;
  return (
    <Container>
      <Row>
        <Title>{title}</Title>
        <div className="w-max">
          <Input
            placeholder="Nombre o documento"
            type="string"
            required
            className="max-w-xs"
            onChange={(e: any) => {
              setQuery(e?.target?.value);
            }}
          />
        </div>
        {onAddClick && (
          <PlusContainer onClick={() => onAddClick()}>
            <BsPlusCircleFill size={26} color="#4318FF" />
          </PlusContainer>
        )}
      </Row>
      {!postulantesLlamadoFound ? (
        filteredUsers?.map((item, index) => {
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
              label={item?.label}
              isAllowedToChange={
                userInfo?.roles.includes(Roles.admin) ||
                userInfo?.roles.includes(Roles.tribunal)
              } // si es coordinador no puede modificar los puntajes.
            />
          );
        })
      ) : filteredPostulantes !== undefined &&
        filteredPostulantes?.length > 0 ? (
        filteredPostulantes?.map((item, index) => {
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
              userName={`${item?.postulante?.nombres} ${item?.postulante?.apellidos}`}
              userlastName={item?.postulante?.documento}
              llamadoId={llamadoId}
              postulanteId={item?.postulante?.id}
              etapaActual={item?.etapa}
              withDot={onRemove !== undefined && onRemove !== null}
              options={optionsToItem}
              showCurrEtapa={showCurrEtapa}
              label={item?.label}
              isAllowedToChange={soyTribunal || isAdmin} // si es coordinador no puede modificar los puntajes.
            />
          );
        })
      ) : (
        <div className="w-full  h-auto flex flex-col items-center py-10 justify-center gap-4">
          <img
            src={NotFoundImage?.src}
            className="object-cover h-[300px] w-auto"
          />
          <Text
            className="!text-[20px] !leading-[24px] h-full!"
            text={
              "No se encontraron postulantes que cumplan con los requisitos."
            }
          />
        </div>
      )}
    </Container>
  );
};

export default ListOfPostulantes;
