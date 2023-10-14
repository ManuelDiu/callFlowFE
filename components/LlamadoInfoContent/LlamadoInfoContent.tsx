import styled from "styled-components";
import tw from "twin.macro";
import { FullLlamadoInfo } from "types/llamado";
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
} from "@/utils/llamadoUtils";
import ListOfUsers from "../ListOfUsers/ListOfUsers";
import { useState } from "react";
import ChnageStatusModal from "../ChangeStatusModal/ChangeStatusModal";
import { useGlobal } from "@/hooks/useGlobal";
import ListOfPostulantes from "../ListOfPostulantes/ListOfPostulantes";
import VerDisponibilidadModal from "../VerDisponibilidadModal/VerDisponibilidadModal";
import { TipoMiembro } from "@/enums/TipoMiembro";
import { Roles } from "@/enums/Roles";
import RenunciarLlamadoModal from "../RenunciarLlamadoModal/RenunciarLlamadoModal";

const Container = styled.div`
  ${tw`w-full h-auto flex flex-col items-start justify-start gap-4`}
`;

const IndicatorsContainer = styled.div`
  ${tw`w-auto h-auto flex flex-row items-center justify-start gap-4`}
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

const LlamadoInfoValue = styled.div`
  ${tw`w-full flex-grow h-auto max-w-full truncate overflow-hidden`}
`;

interface Props {
  llamadoInfo: FullLlamadoInfo;
}

const LlamadoInfoContent = ({ llamadoInfo }: Props) => {
  const [openCambiarEstadoModal, setOpenCambarEstadoModal] = useState(false);
  const [verDisponibilidad, setVerDisponibilidad] = useState(false);
  const [openRenunciarLlamadoModal, setOpenRenunciarLlamadoModal] =
    useState(false);

  const { userInfo } = useGlobal();
  const miembrosTribunal = llamadoInfo.miembrosTribunal || [];

  const isMiembro =
    typeof miembrosTribunal?.find(
      (item) =>
        item?.usuario?.id === userInfo?.id &&
        item?.tipoMiembro === TipoMiembro.titular
    ) !== "undefined";

    const renuncio = miembrosTribunal?.find(
      (item) =>
        item?.usuario?.id === userInfo?.id
    )?.motivoRenuncia !== "";

  const { isAdmin, isSolicitante } = useGlobal();

  const handleGenerateGrilla = () => {
    // generate grilla and download it
  };

  const handleGetStatusBadge = () => {
    return (
      <LlamadoEstadoBubble estado={llamadoInfo?.estadoActual?.nombre as any} />
    );
  };

  const handleGetEtapaBadge = () => {
    console.log("llamadoInfo", llamadoInfo);
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
    console.log("color", color);

    return (
      <LlamadoEstadoBubble customColor={color} estado={etapaText as any} />
    );
  };

  return (
    <Container>
      {openCambiarEstadoModal && (
        <ChnageStatusModal
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
            action={handleGenerateGrilla}
          />
        )}
        {isAdmin ||
          (isMiembro && (
            <Button
              icon={<TbArrowsExchange color="#4318FF" size={18} />}
              variant="outline"
              text="Cambiar estado"
              action={() => setOpenCambarEstadoModal(!openCambiarEstadoModal)}
            />
          ))}

        {isMiembro && !renuncio && (
          <Button
            variant="red"
            text="Renunciar al llamado"
            action={() =>
              setOpenRenunciarLlamadoModal(!openRenunciarLlamadoModal)
            }
          />
        )}

        <Button
          icon={<BiCalendar color="#4318FF" size={18} />}
          variant="outline"
          text="Disponibilidad tribunal"
          action={() => setVerDisponibilidad(!verDisponibilidad)}
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
            <LlamadoInfoValue>{handleGetEtapaBadge()}</LlamadoInfoValue>
          </LlamadoInfoLine>
          <LlamadoInfoLine>
            <LlamadoInfoKey>Horas</LlamadoInfoKey>
            <LlamadoInfoValue>{llamadoInfo?.cantidadHoras}</LlamadoInfoValue>
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
      />
      <ListOfUsers
        title="Miembros del tribunal"
        selectedUsers={formatTribunales(llamadoInfo?.miembrosTribunal)}
      />

      {verDisponibilidad && (
        <VerDisponibilidadModal
          isMiembro={isMiembro}
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
    </Container>
  );
};

export default LlamadoInfoContent;
