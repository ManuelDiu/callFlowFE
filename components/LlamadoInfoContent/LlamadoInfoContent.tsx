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
import { formatEtapas, formatPostulantes, formatTribunales } from "@/utils/llamadoUtils";
import ListOfUsers from "../ListOfUsers/ListOfUsers";

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
      <IndicatorsContainer>
        <IndicatorItem>
          <IndicatorBadge style={{ background: "#0FBB00" }} />
          <IndicatorText>Cumple plazo dias</IndicatorText>
        </IndicatorItem>
        <IndicatorItem>
          <IndicatorBadge style={{ background: "#E5E84F" }} />

          <IndicatorText>Proximo a cumplir plazo dias</IndicatorText>
        </IndicatorItem>
        <IndicatorItem>
          <IndicatorBadge style={{ background: "#F55F5F" }} />
          <IndicatorText>Excede plazo dias</IndicatorText>
        </IndicatorItem>
      </IndicatorsContainer>
      <ActionsContainer>
        <Button
          icon={<AiOutlineFileAdd color="white" size={18} />}
          text="Generar Grilla"
          action={handleGenerateGrilla}
        />
        <Button
          icon={<TbArrowsExchange color="#4318FF" size={18} />}
          variant="outline"
          text="Cambiar estado"
          action={handleGenerateGrilla}
        />
        <Button
          icon={<BiCalendar color="#4318FF" size={18} />}
          variant="outline"
          text="Disponibilidad tribunal"
          action={handleGenerateGrilla}
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

      <ListOfUsers
        title="Listado de postulantes"
        selectedUsers={formatPostulantes(llamadoInfo?.postulantes)}
      />
      <ListOfUsers
        title="Miembros del tribunal"
        selectedUsers={formatTribunales(llamadoInfo?.miembrosTribunal)}
      />
    </Container>
  );
};

export default LlamadoInfoContent;
