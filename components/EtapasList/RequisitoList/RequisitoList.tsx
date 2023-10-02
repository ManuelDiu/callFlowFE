import styled from "styled-components";
import tw from "twin.macro";
import { Etapa, Requisito, SubEtapa } from "types/etapa";
import Input from "@/components/Inputs/Input";
import Button from "@/components/Buttons/Button";
import { IoMdAdd } from "react-icons/io";
import Text from "@/components/Table/components/Text";
import { emptyRequisito, emptySubEtapa } from "@/utils/etapa";
import { BsTrash3 } from "react-icons/bs";
import Checkbox from "@/components/Inputs/Checkbox";

const Container = styled.div`
  ${tw`w-full p-6 pt-8 relative h-auto flex flex-col items-center justify-start gap-y-4 bg-subEtapaItem rounded-2xl shadow-md`}
`;

const Row = styled.div`
  ${tw`w-full h-auto gap-4 flex flex-row items-center justify-center`}
`;

interface Props {
  requisitos: Requisito[];
  setRequisitos: any;
  isView?: boolean;
}

const RequisitoList = ({ requisitos, setRequisitos, isView = false }: Props) => {
  const handleChangeSubEtapaField = (
    requisitoItem: Requisito,
    field: string,
    value: any
  ) => {
    const newSubEtapas = requisitos?.map((requisito: Requisito) => {
      if (requisito?.index === requisitoItem?.index) {
        return {
          ...requisito,
          [field]: value,
        };
      }
      return requisito;
    });
    setRequisitos(newSubEtapas);
  };

  const handleRemoveRequisito = (index: any) => {
    setRequisitos(requisitos?.filter((req) => req?.index !== index));
  };

  return requisitos?.map((requisito, index) => {
    return (
      <Container className="modalOpen group" key={`etapa-${index}`}>
        {!isView && <BsTrash3
          onClick={() => handleRemoveRequisito(requisito?.index)}
          className="absolute opacity-0 transition-all group-hover:opacity-[100] cursor-pointer top-3 right-3"
          size={24}
          color="#DC2626"
        />}
        <Row>
          <Input
          disabled={isView}
            label="Nombre"
            placeholder="Ingrese un nombre de requisito"
            type="string"
            className="flex-grow w-full"
            required
            onChange={(e: any) =>
              handleChangeSubEtapaField(requisito, "nombre", e?.target?.value)
            }
            value={requisito?.nombre}
          />
        </Row>
        <Row>
          <Input
            label="Puntaje"
            placeholder="Ingrese un puntaje"
            type="number"
            className="flex-grow w-full"
            required
            onChange={(e: any) =>
              handleChangeSubEtapaField(requisito, "puntaje", e?.target?.value)
            }
            disabled={isView}
            value={requisito?.puntaje}
            // isInvalid={!!errors[crearLlamadoFormFields.referencia]?.message}
            // inputFormName={crearLlamadoFormFields.referencia}
          />
        </Row>
        <Checkbox
          label="Excluyente"
          disabled={isView}
          setValue={(val: any) =>
            handleChangeSubEtapaField(requisito, "excluyente", val)
          }
        />
      </Container>
    );
  });
};

export default RequisitoList;
