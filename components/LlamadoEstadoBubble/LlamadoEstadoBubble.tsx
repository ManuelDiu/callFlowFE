import { EstadoLlamadoEnum } from "@/enums/EstadoLlamadoEnum";
import styled from "styled-components";
import tw from "twin.macro";

const colorVariants: any = {
  [EstadoLlamadoEnum.creado]: tw`bg-[#3498db]`,
  [EstadoLlamadoEnum.enRelevamiento]: tw`bg-[#f1c40f]`,
  [EstadoLlamadoEnum.listoParaEstudioMerito]: tw`bg-[#27ae60]`,
  [EstadoLlamadoEnum.enEstudioMerito]: tw`bg-[#2ecc71]`,
  [EstadoLlamadoEnum.listoParaEntrevistas]: tw`bg-[#e74c3c]`,
  [EstadoLlamadoEnum.enEntrevias]: tw`bg-[#c0392b]`,
  [EstadoLlamadoEnum.listoParaPsicotecnico]: tw`bg-[#9b59b6]`,
  [EstadoLlamadoEnum.enPsicotecnico]: tw`bg-[#8e44ad]`,
  [EstadoLlamadoEnum.listoParaFirmarGrilla]: tw`bg-[#f39c12]`,
  [EstadoLlamadoEnum.enProcesoDeFrimaGrilla]: tw`bg-[#d35400]`,
  [EstadoLlamadoEnum.listoParaFirmarActaFinal]: tw`bg-[#3498db]`,
  [EstadoLlamadoEnum.enProcesoDeFrimaActaFinal]: tw`bg-[#2980b9]`,
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
}

const LlamadoEstadoBubble = ({ estado = EstadoLlamadoEnum.creado }: Props) => {

  return (
    <Container estado={estado}>
      <Bubble />
      <Text>{estado || "Creado"}</Text>
    </Container>
  );
};

export default LlamadoEstadoBubble;
