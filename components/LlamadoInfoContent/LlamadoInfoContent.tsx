import styled from "styled-components";
import tw from "twin.macro";
import { AgregarPostulanteALlamadoData, FullLlamadoInfo } from "types/llamado";
import Button from "../Buttons/Button";
import { AiOutlineFileAdd } from "react-icons/ai";
import { TbArrowsExchange } from "react-icons/tb";
import { BiCalendar } from "react-icons/bi";
import UserInfoLine from "../Table/components/UserInfoLine";
import LlamadoEstadoBubble from "../LlamadoEstadoBubble/LlamadoEstadoBubble";
import moment from "moment";
import { EtapaList } from "types/template";
import {
  formatEtapas,
  formatPostulantes,
  formatTribunales,
  isLlamadoDisabled,
} from "@/utils/llamadoUtils";
import ListOfUsers from "../ListOfUsers/ListOfUsers";
import { useEffect, useState } from "react";
import ChnageStatusModal from "../ChangeStatusModal/ChangeStatusModal";
import { useGlobal } from "@/hooks/useGlobal";
import ListOfPostulantes from "../ListOfPostulantes/ListOfPostulantes";
import VerDisponibilidadModal from "../VerDisponibilidadModal/VerDisponibilidadModal";
import { TipoMiembro } from "@/enums/TipoMiembro";
import { Roles } from "@/enums/Roles";
import RenunciarLlamadoModal from "../RenunciarLlamadoModal/RenunciarLlamadoModal";
import Modal from "../Modal/Modal";
import GrillaPDF from "../GrillaPDF/GrillaPDF";
import AddTribunalModal from "../AddTribunalModal/AddTribunalModal";
import EditTribunalModal from "../AddTribunalModal/EditTribunalModal";
import ITRBubble from "../Table/components/ITRBubble";
import { EstadoLlamadoEnum } from "@/enums/EstadoLlamadoEnum";
import { agregarPostulanteALlamadoExistente } from "@/controllers/llamadoController";
import { useMutation } from "@apollo/client";
import AddPostulanteModal from "../AddPostulanteModal/AddPostulanteModal";
import { SortUserInfo } from "types/usuario";
import toast from "react-hot-toast";

const Container = styled.div`
  ${tw`w-full h-auto flex flex-col items-start justify-start gap-4`}
`;

const IndicatorsContainer = styled.div`
  ${tw`w-auto h-auto flex md:flex-row flex-col md:items-center items-start md:my-0 my-4 justify-start gap-4`}
`;

const IndicatorItem = styled.div`
  ${tw`w-auto h-auto flex flex-row items-center justify-center gap-2`}
`;

const IndicatorText = styled.span`
  ${tw`text-texto font-bold text-sm`}
`;

const IndicatorBadge = styled.span`
  ${tw`w-[10px] h-[10px] shadow-sm min-w-[10px] rounded-full`}
`;

const ActionsContainer = styled.div`
  ${tw`w-full h-auto flex flex-row items-center justify-start gap-4 flex-wrap`}
`;

const LlamadoInfoContainer = styled.div`
  ${tw`w-full h-auto flex flex-col items-start justify-start gap-0 flex-wrap bg-white p-0 rounded-2xl shadow-md`}
`;

const LlamadoInfoHeader = styled.div`
  ${tw`w-full h-auto flex flex-col gap-1 p-6`}
`;

const LlamadoInfoHeaderTitle = styled.span`
  ${tw`text-texto font-medium text-base`}
`;

const LlamadoInfoHeaderSubtitle = styled.span`
  ${tw`text-textogris font-normal text-sm`}
`;

const LlamadoInfoContentLines = styled.div`
  ${tw`w-full h-auto flex flex-col items-start justify-start gap-0 border-t border-gray-300 pt-2 px-6 pb-0`}
`;

const LlamadoInfoLine = styled.div`
  ${tw`w-full flex flex-row h-auto py-4 border-b border-gray-300`}
`;

const LlamadoInfoKey = styled.div`
  ${tw`min-w-[150px] font-semibold max-w-full truncate overflow-hidden flex text-left text-sm font-medium`}
`;

const CategoriaContainer = styled.div`
  ${tw`flex-grow w-full h-auto flex flex-row items-center justify-start gap-2 flex-wrap`}
`;

const LlamadoInfoValue = styled.div`
  ${tw`w-full flex-grow h-auto max-w-full truncate overflow-hidden`}
`;

const CategoriaBadge = styled.div`
  ${tw`w-auto h-auto flex items-center justify-center px-2 py-1 rounded-full shadow-sm font-medium bg-gray-200`}
`;

interface Props {
  llamadoInfo: FullLlamadoInfo;
  query: any;
}

const DEFAULT_VER_DISPONIBILIDAD_TITLE = "Ver disponibilidad del tribunal";

const LlamadoInfoContent = ({ llamadoInfo, query }: Props) => {
  const [openPostulantesModal, setOpenPostulantesModal] = useState(false);
  const [selectedPostulantes, setSelectedPostulantes] = useState<
    SortUserInfo[]
  >([]);
  const { handleSetLoading } = useGlobal();

  const [openCambiarEstadoModal, setOpenCambarEstadoModal] = useState(false);
  const [verDisponibilidad, setVerDisponibilidad] = useState(false);
  const [openRenunciarLlamadoModal, setOpenRenunciarLlamadoModal] =
    useState(false);
  const [previewGrilla, setPreviewGrilla] = useState(false);
  const [selectedTribunalToEdit, setSelectedTribunalToEdit] =
    useState<any>(null);
  const [disponibilidadTitle, setDisponibilidadTitle] = useState(
    DEFAULT_VER_DISPONIBILIDAD_TITLE
  );

  const { userInfo } = useGlobal();
  const miembrosTribunal = llamadoInfo.miembrosTribunal || [];
  const isDeleted = isLlamadoDisabled(llamadoInfo);

  const [agregarPostulante] = useMutation(agregarPostulanteALlamadoExistente);

  const isMiembro =
    typeof miembrosTribunal?.find(
      (item) =>
        item?.usuario?.id === userInfo?.id &&
        item?.tipoMiembro === TipoMiembro.titular
    ) !== "undefined";

  const renuncio =
    miembrosTribunal?.find((item) => item?.usuario?.id === userInfo?.id)
      ?.motivoRenuncia !== "";

  const { isAdmin, isSolicitante } = useGlobal();

  const handleGenerateGrilla = () => {
    setPreviewGrilla(true);
    // generate grilla and download it
  };

  useEffect(() => {
    if (!verDisponibilidad) {
      setDisponibilidadTitle(DEFAULT_VER_DISPONIBILIDAD_TITLE);
    }
  }, [verDisponibilidad]);

  const handleGetStatusBadge = () => {
    return (
      <LlamadoEstadoBubble estado={llamadoInfo?.estadoActual?.nombre as any} />
    );
  };

  const handleGetCategorias = () => {
    return (
      <CategoriaContainer>
        {llamadoInfo?.categorias?.map((cat) => {
          return <CategoriaBadge key={cat?.id}>{cat?.nombre}</CategoriaBadge>;
        })}
      </CategoriaContainer>
    );
  };

  const handleGetEtapaBadge = () => {
    const currentEtapa: EtapaList = llamadoInfo?.etapaActual;
    if (!currentEtapa) {
      return "Este llamado aun no paso a la siguiente etapa";
    }
    const etapaText = currentEtapa.nombre;
    const currentDate = moment();
    const updatedTime = moment(llamadoInfo?.etapaUpdated);
    const etapaUpdatedDiff = updatedTime.diff(currentDate, "days");
    let color = "";
    if (etapaUpdatedDiff <= -10) {
      color = "#F55F5F";
    } else if (etapaUpdatedDiff <= -7) {
      color = "#E5E84F";
    } else {
      color = "#0FBB00";
    }
    return (
      <LlamadoEstadoBubble customColor={color} estado={etapaText as any} />
    );
  };

  const handleOpenEditModal = (item: any) => {
    setSelectedTribunalToEdit(item);
  };

  const onOpenDisponibilidad = (text: string) => {
    setVerDisponibilidad(true);
    setDisponibilidadTitle(text);
  };

  const handleAddPostulante = (data: SortUserInfo) => {
    // setSelectedPostulantes([...selectedPostulantes, data]);
    addPostToLlamado(data.id);
  };

  const addPostToLlamado = async (postulanteId: number) => {
    const data: AgregarPostulanteALlamadoData = {
      llamadoId: llamadoInfo?.id,
      postulanteId: postulanteId,
    };
    handleSetLoading(true);
    const resp = await agregarPostulante({
      variables: {
        data: data,
      },
      refetchQueries: [
        {
          query: query,
          variables: {
            llamadoId: llamadoInfo?.id,
          },
        },
      ],
    });
    if (resp?.data?.agregarPostulanteALlamadoExistente?.ok === true) {
      toast.success("Postulante agregado correctamente.");
      handleSetLoading(false);
    } else {
      resp?.data?.agregarPostulanteALlamadoExistente.message
        ? toast.error(resp?.data?.agregarPostulanteALlamadoExistente.message)
        : toast.error(
            "Error inesperado al intentar agregar el postulante al llamado."
          );
      handleSetLoading(false);
    }
  };

  return (
    <Container data-testid="LlamadoInfoContent">
      {openCambiarEstadoModal && (
        <ChnageStatusModal
          onOpenDisponibilidad={onOpenDisponibilidad}
          llamadoInfo={llamadoInfo}
          setOpen={setOpenCambarEstadoModal}
        />
      )}
      <IndicatorsContainer>
        <IndicatorItem>
          <IndicatorBadge style={{ background: "#0FBB00" }} />
          <IndicatorText>Etapa cumple plazo dias</IndicatorText>
        </IndicatorItem>
        <IndicatorItem>
          <IndicatorBadge style={{ background: "#E5E84F" }} />

          <IndicatorText>Etapa proximo a cumplir plazo dias</IndicatorText>
        </IndicatorItem>
        <IndicatorItem>
          <IndicatorBadge style={{ background: "#F55F5F" }} />
          <IndicatorText>Etapa excede plazo dias</IndicatorText>
        </IndicatorItem>
      </IndicatorsContainer>
      <ActionsContainer>
        {isAdmin && (
          <Button
            icon={<AiOutlineFileAdd color="white" size={18} />}
            text="Generar Grilla"
            disabled={isDeleted}
            action={!isDeleted ? () => handleGenerateGrilla() : () => null}
          />
        )}
        {/* {Check} */}
        {(isMiembro || isAdmin) && (
          <Button
            icon={<TbArrowsExchange color="#4318FF" size={18} />}
            variant="outline"
            text="Cambiar estado"
            disabled={isDeleted}
            action={
              !isDeleted
                ? () => setOpenCambarEstadoModal(!openCambiarEstadoModal)
                : () => null
            }
          />
        )}

        {isMiembro && !renuncio && (
          <Button
            variant="red"
            text="Renunciar al llamado"
            disabled={isDeleted}
            action={
              !isDeleted
                ? () => setOpenRenunciarLlamadoModal(!openRenunciarLlamadoModal)
                : () => null
            }
          />
        )}

        <Button
          icon={<BiCalendar color="#4318FF" size={18} />}
          variant="outline"
          text="Disponibilidad tribunal"
          disabled={isDeleted}
          action={
            !isDeleted
              ? () => setVerDisponibilidad(!verDisponibilidad)
              : () => null
          }
        />
      </ActionsContainer>

      <LlamadoInfoContainer>
        <LlamadoInfoHeader>
          <LlamadoInfoHeaderTitle>Detalles del llamado</LlamadoInfoHeaderTitle>
          <LlamadoInfoHeaderSubtitle>
            Revisa todos los detalles del llamado
          </LlamadoInfoHeaderSubtitle>
        </LlamadoInfoHeader>
        <LlamadoInfoContentLines>
          <LlamadoInfoLine>
            <LlamadoInfoKey>Nombre</LlamadoInfoKey>
            <LlamadoInfoValue>{llamadoInfo?.nombre}</LlamadoInfoValue>
          </LlamadoInfoLine>
          <LlamadoInfoLine>
            <LlamadoInfoKey>ITR</LlamadoInfoKey>
            <LlamadoInfoValue>
              <ITRBubble itr={llamadoInfo?.itr} />
            </LlamadoInfoValue>
          </LlamadoInfoLine>
          <LlamadoInfoLine>
            <LlamadoInfoKey>Referencia</LlamadoInfoKey>
            <LlamadoInfoValue>{llamadoInfo?.referencia}</LlamadoInfoValue>
          </LlamadoInfoLine>
          <LlamadoInfoLine>
            <LlamadoInfoKey>Cargo</LlamadoInfoKey>
            <LlamadoInfoValue>
              {llamadoInfo?.cargo?.nombre || "Sin cargo asociado"}
            </LlamadoInfoValue>
          </LlamadoInfoLine>
          <LlamadoInfoLine>
            <LlamadoInfoKey>Cupos</LlamadoInfoKey>
            <LlamadoInfoValue>{llamadoInfo?.cupos}</LlamadoInfoValue>
          </LlamadoInfoLine>
          <LlamadoInfoLine>
            <LlamadoInfoKey>Estado</LlamadoInfoKey>
            <LlamadoInfoValue>{handleGetStatusBadge()}</LlamadoInfoValue>
          </LlamadoInfoLine>
          <LlamadoInfoLine>
            <LlamadoInfoKey>Etapa</LlamadoInfoKey>
            <div className="w-full flex-grow max-w-full overflow-hidden h-auto flex flex-col gap-1">
              <LlamadoInfoValue title={(handleGetEtapaBadge() as string) ?? ""}>
                {handleGetEtapaBadge()}
              </LlamadoInfoValue>
              {llamadoInfo?.etapaActual && (
                <span className="text-sm text-gray-900 font-medium">
                  Plazo de dias de esta etapa:{" "}
                  {llamadoInfo?.etapaActual?.plazoDias}
                </span>
              )}
            </div>
          </LlamadoInfoLine>
          <LlamadoInfoLine>
            <LlamadoInfoKey>Horas</LlamadoInfoKey>
            <LlamadoInfoValue>{llamadoInfo?.cantidadHoras}</LlamadoInfoValue>
          </LlamadoInfoLine>
          <LlamadoInfoLine>
            <LlamadoInfoKey>Categorias</LlamadoInfoKey>
            <LlamadoInfoValue>{handleGetCategorias()}</LlamadoInfoValue>
          </LlamadoInfoLine>
          <LlamadoInfoLine>
            <LlamadoInfoKey>Postulantes</LlamadoInfoKey>
            <LlamadoInfoValue>
              {llamadoInfo?.postulantes?.length || 0}
            </LlamadoInfoValue>
          </LlamadoInfoLine>
          <LlamadoInfoLine>
            <LlamadoInfoKey>Solicitante</LlamadoInfoKey>
            <LlamadoInfoValue>
              <UserInfoLine
                userImage={llamadoInfo?.solicitante?.imageUrl}
                userName={`${llamadoInfo?.solicitante?.name} ${llamadoInfo?.solicitante?.lastName}`}
                userlastName="Solicitante"
              />
            </LlamadoInfoValue>
          </LlamadoInfoLine>
        </LlamadoInfoContentLines>
      </LlamadoInfoContainer>

      <ListOfPostulantes
        title="Listado de postulantes"
        llamadoId={llamadoInfo?.id}
        selectedUsers={formatPostulantes(llamadoInfo?.postulantes)}
        onAddClick={
          llamadoInfo?.estadoActual.nombre ===
          EstadoLlamadoEnum.publicacionPendiente
            ? () => setOpenPostulantesModal(!openPostulantesModal)
            : undefined
        }
      />
      <ListOfUsers
        onEdit={handleOpenEditModal}
        title="Miembros del tribunal"
        isTribunal
        selectedUsers={formatTribunales(llamadoInfo?.miembrosTribunal)}
      />

      {previewGrilla && (
        <Modal
          textok="Aceptar"
          onSubmit={() => setPreviewGrilla(false)}
          content={<GrillaPDF llamadoInfo={llamadoInfo} />}
          title="Grilla del llamado"
          setOpen={setPreviewGrilla}
          description="Previsualiza la informacion antes de generar el archivo, si sobrescribes el archivo ya existente , se perderan todas las firmas que el archivo tenga hasta el momento , puedes ver esto en la seccion de archivos, al realizar esta accion , se generara un archivo en la seccion Archivos - Archivos con firma listo para firmar por los miembros del tribunal"
        />
      )}

      {selectedTribunalToEdit !== null && (
        <EditTribunalModal
          llamadoId={llamadoInfo?.id}
          selectedUser={selectedTribunalToEdit}
          setOpen={() => setSelectedTribunalToEdit(null)}
        />
      )}

      {verDisponibilidad && (
        <VerDisponibilidadModal
          isMiembro={isMiembro}
          title={disponibilidadTitle}
          llamadoId={llamadoInfo?.id}
          setOpen={setVerDisponibilidad}
        />
      )}

      {openRenunciarLlamadoModal && isMiembro && (
        <RenunciarLlamadoModal
          llamadoId={llamadoInfo?.id}
          setOpen={setOpenRenunciarLlamadoModal}
        />
      )}

      {openPostulantesModal && (
        <AddPostulanteModal
          selectedUsers={selectedPostulantes}
          addPostulanteToList={handleAddPostulante}
          setOpen={setOpenPostulantesModal}
        />
      )}
    </Container>
  );
};

export default LlamadoInfoContent;
