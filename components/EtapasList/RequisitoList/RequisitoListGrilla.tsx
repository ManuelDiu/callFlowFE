import styled from "styled-components";
import tw from "twin.macro";
import { Etapa, Requisito, RequisitoGrilla, SubEtapa } from "types/etapa";
import Input from "@/components/Inputs/Input";
import Button from "@/components/Buttons/Button";
import { IoMdAdd } from "react-icons/io";
import Text from "@/components/Table/components/Text";
import { emptyRequisito, emptySubEtapa } from "@/utils/etapa";
import { BsTrash3 } from "react-icons/bs";
import Checkbox from "@/components/Inputs/Checkbox";

const Container = styled.div`
  ${tw`w-full p-6 pt-8 relative h-auto flex flex-col items-start justify-start gap-y-4 bg-subEtapaItem rounded-2xl shadow-md overflow-hidden`}
`;

const Row = styled.div`
  ${tw`w-full h-auto gap-4 flex flex-row items-center justify-center`}
`;

interface Props {
  requisitos: RequisitoGrilla[];
  setRequisitos: any;
  isView?: boolean;
}

const RequisitoListGrilla = ({
  requisitos,
  setRequisitos,
  isView = false,
}: Props) => {
  const handleChangeSubEtapaField = (
    requisitoItem: RequisitoGrilla,
    field: string,
    value: any
  ) => {
    const newSubEtapas = requisitos?.map((requisito: RequisitoGrilla) => {
      if (requisito?.id === requisitoItem?.id) {
        return {
          ...requisito,
          [field]: value,
        };
      }
      return requisito;
    });
    setRequisitos(newSubEtapas);
  };

  return requisitos?.map((requisito, index) => {
    return (
      <Container className="modalOpen group" key={`etapa-${index}`}>
        <div className="flex w-full text-lg font-medium">
          <p className="break-words max-w-full w-full">{requisito?.nombre}</p>
        </div>
        <div className="flex flex-col w-full gap-2">
          <span className="text-sm font-medium text-texto">
            Puntaje sugerido: {requisito?.puntajeSugerido}
          </span>
          <Input
            label="Puntaje"
            placeholder="Ingrese el puntaje"
            type="number"
            className="flex-grow w-full"
            required
            onChange={(e: any) =>{
              handleChangeSubEtapaField(requisito, "puntaje", e?.target?.value)
            }}
            // disabled={isView}
            value={requisito?.puntaje}
          />
        </div>
        {requisito?.excluyente ?? <span>Este requisito es excluyente.</span>}
      </Container>
    );
  });
};

export default RequisitoListGrilla;
