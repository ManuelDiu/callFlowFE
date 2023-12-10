import { EstadoLlamadoEnum } from "@/enums/EstadoLlamadoEnum";
import clsx from "clsx";
import styled from "styled-components";
import tw from "twin.macro";

const colorVariants: any = {
  [EstadoLlamadoEnum.publicacionPendiente]: tw`bg-[#3498db]`,
  [EstadoLlamadoEnum.abierto]: tw`bg-[#f1c40f]`,
  [EstadoLlamadoEnum.bajarCvs]: tw`bg-[#27ae60]`,
  [EstadoLlamadoEnum.conformacionTribunal]: tw`bg-[#2ecc71]`,
  [EstadoLlamadoEnum.cvsCompartidos]: tw`bg-[#e74c3c]`,
  [EstadoLlamadoEnum.entrevistas]: tw`bg-[#c0392b]`,
  [EstadoLlamadoEnum.psicotecnicoSolicitado]: tw`bg-[#9b59b6]`,
  [EstadoLlamadoEnum.psicotecnicoCompartido]: tw`bg-[#8e44ad]`,
  [EstadoLlamadoEnum.pendienteHacerActa]: tw`bg-[#f39c12]`,
  [EstadoLlamadoEnum.pendienteHacerFirma]: tw`bg-[#d35400]`,
  [EstadoLlamadoEnum.pendieteSubidaCDC]: tw`bg-[#3498db]`,
  [EstadoLlamadoEnum.pendienteSubidaCDACGA]: tw`bg-[#2980b9]`,
  [EstadoLlamadoEnum.finalizado]: tw`bg-[#2ecc71]`,
  [EstadoLlamadoEnum.eliminado]: tw`bg-[#95a5a6]`,
};

const Container = styled.div<{ estado: EstadoLlamadoEnum }>`
  ${tw`w-fit h-auto px-2 flex py-[2px] flex-row items-center gap-[4px] py-0 rounded-[6px] shadow-sm max-w-full overflow-hidden`}
  ${({ estado }) => colorVariants[estado]}
`;

const Bubble = styled.div`
  ${tw`rounded-full bg-white w-[6px] h-[6px]`}
`;

const Text = styled.span`
  ${tw`text-white font-normal text-[14px] max-w-full overflow-hidden truncate`}
`;

interface Props {
  estado?: EstadoLlamadoEnum;
  customColor?: String;
}

const LlamadoEstadoBubble = ({
  estado = EstadoLlamadoEnum.abierto,
  customColor,
}: Props) => {
  return (
    <Container
         estado={estado}
      style={customColor ? { background: `${customColor}`}: {}}
    >
      <Bubble />
      <Text title={estado || "Creado"}>{estado || "Creado"}</Text>
    </Container>
  );
};

export default LlamadoEstadoBubble;
