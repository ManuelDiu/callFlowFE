import styled from "styled-components";
import tw from "twin.macro";
import { Etapa, Requisito, SubEtapa } from "types/etapa";
import Input from "@/components/Inputs/Input";
import Button from "@/components/Buttons/Button";
import { IoMdAdd } from "react-icons/io";
import Text from "@/components/Table/components/Text";
import { emptyRequisito, emptySubEtapa } from "@/utils/etapa";
import RequisitoList from "../RequisitoList/RequisitoList";
import { BsTrash3 } from "react-icons/bs";
import { useEffect } from "react";
import OneLineError from "@/components/OneLineError/OneLineError";

const Container = styled.div`
  ${tw`w-full p-6 pt-8 relative h-auto flex flex-col items-center justify-start gap-y-4 bg-subEtapaItem rounded-2xl shadow-md`}
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
  subetapas: SubEtapa[];
  setSubEtapas: any;
}

const SubEtapaList = ({ subetapas, setSubEtapas }: Props) => {
  const handleChangeSubEtapaField = (
    subEtapaItem: SubEtapa,
    field: string,
    value: any
  ) => {
    const newSubEtapas = subetapas?.map((subetapa: SubEtapa) => {
      if (subetapa?.index === subEtapaItem?.index) {
        return {
          ...subetapa,
          [field]: value,
        };
      }
      return subetapas;
    });
    setSubEtapas(newSubEtapas);
  };

  const handleAddRequisito = (index: any) => {
    const newSubEtapas = subetapas?.map((subEtapa) => {
      if (subEtapa?.index === index) {
        return {
          ...subEtapa,
          requisitos: [
            ...subEtapa?.requisitos,
            {
              ...emptyRequisito,
              index: subEtapa?.requisitos?.length + 1,
            },
          ],
        };
      }
      return subEtapa;
    });
    setSubEtapas(newSubEtapas);
  };

  const handleSetRequisitos = (subEtapaIndex: any, requisitos: Requisito[]) => {
    const newSubEtapas = subetapas?.map((subEtapa) => {
      if (subEtapa?.index === subEtapaIndex) {
        return {
          ...subEtapa,
          requisitos: requisitos,
        };
      }
      return subEtapa;
    });
    setSubEtapas(newSubEtapas);
  };

  const handleRemoveEtapa = (index: any) => {
    setSubEtapas(subetapas?.filter((sbetapa) => sbetapa?.index !== index));
  };

  return subetapas?.map((subEtapa, index) => {
    let sumOfRequisitos: number = 0;
    subEtapa?.requisitos?.forEach((req) => {
      sumOfRequisitos += Number(req?.puntaje);
    })

    return (
      <Container className="modalOpen group" key={`etapa-${index}`}>
        <Row>
          <Input
            label="Nombre"
            placeholder="Ingrese un nombre de subetapa"
            type="string"
            className="flex-grow w-full"
            required
            onChange={(e: any) =>
              handleChangeSubEtapaField(subEtapa, "nombre", e?.target?.value)
            }
            value={subEtapa?.nombre}
            // isInvalid={!!errors[crearLlamadoFormFields.referencia]?.message}
            // inputFormName={crearLlamadoFormFields.referencia}
          />
          <Cell className="justify-end gap-4">
            <BsTrash3
              onClick={() => handleRemoveEtapa(subEtapa?.index)}
              className="opacity-0 transition-all group-hover:opacity-[100] cursor-pointer top-3 right-3"
              size={24}
              color="#DC2626"
            />

            <Button
              icon={<IoMdAdd color="#4318FF" size={24} />}
              text="Agregar requisito"
              variant="outline"
              action={() => handleAddRequisito(subEtapa?.index)}
              className="!py-2 shadow-md !text-sm"
              sizeVariant="fit"
            />
          </Cell>
        </Row>
        <Row>
          <Input
            label="Puntaje maximo"
            placeholder="Puntaje maximo"
            type="number"
            min={0}
            className="flex-grow w-full"
            required
            onChange={(e: any) =>
              handleChangeSubEtapaField(
                subEtapa,
                "puntajeMaximo",
                e?.target?.value
              )
            }
            value={subEtapa?.puntajeMaximo}
          />
          <Cell className="pl-4">
            <Text className="!text-[20px]" text={`Total: ${sumOfRequisitos || 0}`} />
          </Cell>
        </Row>
        <div className="w-full">
          {
            Number(sumOfRequisitos) > Number(subEtapa?.puntajeMaximo) &&
            <OneLineError message={"La suma de los requisitos no puede superar el maximo"} />
          }
        </div>
        <SectionTitle>Requisitos</SectionTitle>
        <RequisitoList
          setRequisitos={(val: any) =>
            handleSetRequisitos(subEtapa?.index, val)
          }
          requisitos={subEtapa?.requisitos}
        />
      </Container>
    );
  });
};

export default SubEtapaList;
