import Image from "next/image";
import styled from "styled-components";
import tw from "twin.macro";
import { SlOptionsVertical } from "react-icons/sl";
import { useState } from "react";
import { OptionsItem } from "@/utils/utils";
import { DEFAULT_USER_IMAGE } from "@/utils/userUtils";
import { LlamadoData } from "types/postulante";

interface Props {
  llamadoInfo?: LlamadoData;
}

const LlamadoInfoSection = styled.section`
  ${tw`flex flex-col gap-2 items-center justify-center w-full`}
`;

const Container = styled.section`
  ${tw`flex flex-col items-start justify-center w-full px-10 py-6 gap-4 bg-white rounded-3xl shadow-md`}
`;

const Row = styled.div`
  ${tw`flex flex-col`}
`;

const LlamadoInfoCard = ({ llamadoInfo }: Props) => {
  return (
    <LlamadoInfoSection data-testid="LlamadoInfo">
      <span className="self-start text-xl text-texto font-bold">
        Datos del Llamado
      </span>
      <Container>
        <Row>
          <span className="font-semibold">Nombre</span>
          <span className="px-2">{llamadoInfo?.nombre}</span>
        </Row>
        <Row>
          <span className="font-semibold">Cargo</span>
          <span className="px-2">{llamadoInfo?.cargo?.nombre}</span>
        </Row>
        <Row>
          <span className="font-semibold">Cantidad de Horas</span>
          <span className="px-2">{llamadoInfo?.cantidadHoras}</span>
        </Row>
        <Row>
          <span className="font-semibold">Referencia</span>
          <span className="px-2">{llamadoInfo?.referencia}</span>
        </Row>
        <Row>
          <span className="font-semibold">Cupos</span>
          <span className="px-2">{llamadoInfo?.cupos}</span>
        </Row>
      </Container>
    </LlamadoInfoSection>
  );
};

export default LlamadoInfoCard;
