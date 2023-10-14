import styled from "styled-components";
import tw from "twin.macro";
import { Etapa, EtapaGrilla, SubEtapa } from "types/etapa";
import Input from "../Inputs/Input";
import Button from "../Buttons/Button";
import { IoMdAdd } from "react-icons/io";
import Text from "../Table/components/Text";
import { emptySubEtapa } from "@/utils/etapa";
import SubEtapaList from "./SubEtapaList/SubEtapaList";
import { BsTrash3 } from "react-icons/bs";
import OneLineError from "../OneLineError/OneLineError";
import SubEtapaListGrilla from "./SubEtapaList/SubEtapaListGrilla";

const Container = styled.div`
  ${tw`w-full relative pt-8 p-6 h-auto flex flex-col items-center justify-start gap-y-4 bg-white rounded-2xl shadow-md`}
`;

const Row = styled.div`
  ${tw`w-full h-auto gap-4 flex flex-row items-center justify-center`}
`;

const Cell = styled.div`
  ${tw`w-full h-full flex flex-grow items-center`}
`;
const SectionTitle = styled.h2`
  ${tw`text-2xl w-full text-left font-semibold text-texto`}
`;

interface Props {
  etapas: EtapaGrilla[];
  setEtapas: any;
  isView?: boolean;
}

const EtapasListGrilla = ({ etapas, setEtapas, isView = false }: Props) => {
  const handleSetSubetapas = (etapaIndex: any, subetapas: SubEtapa[]) => {
    const newEtapas = etapas?.map((etapa) => {
      if (etapa?.id === etapaIndex) {
        return {
          ...etapa,
          subetapas: subetapas,
        };
      }
      return etapa;
    });
    setEtapas(newEtapas);
  };

  return etapas?.map((etapa, index) => {
    let sumOfSubetapas = 0;
    etapa?.subetapas?.forEach((subetapa) => {
      let totalSubetapa = 0;
      subetapa?.requisitos?.forEach((req) => {
        totalSubetapa += Number(req?.puntaje || 0);
      })
      sumOfSubetapas += Number(totalSubetapa);
    })

    return (
      <Container className="modalOpen group" key={`etapa-${index}`}>
        <SectionTitle>Subetapas</SectionTitle>
        <SubEtapaListGrilla
          // setSubEtapas={(values: any) =>
          //   handleSetSubetapas(etapa?.index, values)
          // }
          subetapas={etapa?.subetapas}
          isView={isView}
        />
      </Container>
    );
  });
};

export default EtapasListGrilla;
