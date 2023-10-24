import styled from "styled-components";
import tw from "twin.macro";
import {
  Etapa,
  Requisito,
  RequisitoGrilla,
  SubEtapa,
  SubEtapaGrilla,
} from "types/etapa";
import OneLineError from "@/components/OneLineError/OneLineError";
import RequisitoListGrilla from "../RequisitoList/RequisitoListGrilla";
import { useEffect } from "react";

const Container = styled.div`
  ${tw`w-full p-6 pt-8 relative h-auto flex flex-col items-center justify-start gap-y-4 bg-subEtapaItem rounded-2xl shadow-md`}
`;

const SectionTitle = styled.h2`
  ${tw`text-2xl w-full text-left font-semibold text-texto`}
`;

interface Props {
  subetapas: SubEtapaGrilla[];
  setSubEtapas?: any;
  isView?: boolean;
  setErrores?: any;
}

const SubEtapaListGrilla = ({
  subetapas,
  setSubEtapas,
  isView = false,
  setErrores,
}: Props) => {
  const handleSetRequisitos = (
    subEtapaIndex: any,
    requisitos: RequisitoGrilla[]
  ) => {
    const newSubEtapas = subetapas?.map((subEtapa) => {
      if (subEtapa?.id === subEtapaIndex) {
        return {
          ...subEtapa,
          requisitos: requisitos,
        };
      }
      return subEtapa;
    });
    setSubEtapas(newSubEtapas);
  };
  let sumOfRequisitos = 0;

  useEffect(() => {
    handleErrores();
  }, [subetapas]);

  const handleErrores = () => {
    subetapas?.map((subEtapa) => {
      subEtapa?.requisitos?.forEach((req: any) => {
        sumOfRequisitos += Number(req.puntaje);
      });
      if (Number(sumOfRequisitos) > Number(subEtapa?.puntajeMaximo)) {
        setErrores(true);
        return;
      } else {
        setErrores(false);
      }
    });
  };
  return subetapas?.map((subEtapa, index) => {
    sumOfRequisitos = 0;
    handleErrores();

    return (
      <Container className="modalOpen group" key={`etapa-${index}`}>
        <div className="flex w-full justify-between h-auto">
          <span className="self-center text-[24px] text-texto font-medium">
            {subEtapa?.nombre}
          </span>
          <div className="flex flex-col items-end">
            <span className="!text-[20px]">{`Subtotal Actual: ${
              sumOfRequisitos || 0
            }`}</span>
            <span className="!text-[20px]">{`Puntaje Máximo: ${
              subEtapa?.puntajeMaximo || 0
            }`}</span>
          </div>
        </div>
        <div className="w-full">
          {Number(sumOfRequisitos) > Number(subEtapa?.puntajeMaximo) && (
            <OneLineError
              message={
                "La suma de los puntajes de los requisitos no puede superar el máximo de la subetapa."
              }
            />
          )}
        </div>
        <SectionTitle>Requisitos de esta subetapa</SectionTitle>
        <RequisitoListGrilla
          setRequisitos={(val: any) => handleSetRequisitos(subEtapa?.id, val)}
          isView={isView}
          requisitos={subEtapa?.requisitos}
        />
      </Container>
    );
  });
};

export default SubEtapaListGrilla;
