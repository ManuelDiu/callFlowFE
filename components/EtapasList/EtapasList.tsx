import styled from "styled-components";
import tw from "twin.macro";
import { Etapa, SubEtapa } from "types/etapa";
import Input from "../Inputs/Input";
import Button from "../Buttons/Button";
import { IoMdAdd } from "react-icons/io";
import Text from "../Table/components/Text";
import { emptySubEtapa } from "@/utils/etapa";
import SubEtapaList from "./SubEtapaList/SubEtapaList";
import { BsTrash3 } from "react-icons/bs";
import OneLineError from "../OneLineError/OneLineError";

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
  etapas: Etapa[];
  setEtapas: any;
}

const EtapasList = ({ etapas, setEtapas }: Props) => {
  const handleChangeEtapaField = (
    etapaItem: Etapa,
    field: string,
    value: any
  ) => {
    const newEtapas = etapas?.map((etapa) => {
      if (etapa?.index === etapaItem?.index) {
        return {
          ...etapa,
          [field]: value,
        };
      }
      return etapa;
    });
    setEtapas(newEtapas);
  };

  const handleAddSubEtapa = (index: any) => {
    const newEtapas = etapas?.map((etapa) => {
      if (etapa?.index === index) {
        return {
          ...etapa,
          subetapas: [
            ...etapa?.subetapas,
            {
              ...emptySubEtapa,
              index: etapa?.subetapas?.length + 1,
            },
          ],
        };
      }
      return etapa;
    });
    setEtapas(newEtapas);
  };

  const handleSetSubetapas = (etapaIndex: any, subetapas: SubEtapa[]) => {
    const newEtapas = etapas?.map((etapa) => {
      if (etapa?.index === etapaIndex) {
        return {
          ...etapa,
          subetapas: subetapas,
        };
      }
      return etapa;
    });
    setEtapas(newEtapas);
  };

  const handleRemoveEtapa = (index: any) => {
    setEtapas(etapas?.filter((etapa) => etapa?.index !== index));
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
        <Row>
          <Input
            label="Nombre"
            placeholder="Ingrese un nombre de etapa"
            type="string"
            className="flex-grow w-full"
            required
            onChange={(e: any) =>
              handleChangeEtapaField(etapa, "nombre", e?.target?.value)
            }
            value={etapa?.nombre}
            // isInvalid={!!errors[crearLlamadoFormFields.referencia]?.message}
            // inputFormName={crearLlamadoFormFields.referencia}
          />
          <Cell className="justify-end gap-4">
            <BsTrash3
              onClick={() => handleRemoveEtapa(etapa?.index)}
              className="opacity-0 transition-all group-hover:opacity-[100] cursor-pointer top-3 right-3"
              size={24}
              color="#DC2626"
            />

            <Button
              icon={<IoMdAdd color="#4318FF" size={24} />}
              text="Agregar subetapa"
              variant="outline"
              action={() => handleAddSubEtapa(etapa?.index)}
              className="!py-2 shadow-md !text-sm"
              sizeVariant="fit"
            />
          </Cell>
        </Row>
        <Row>
          <Input
            label="Plazo Dias"
            placeholder="Ingrese un plazo de dias"
            type="number"
            className="flex-grow w-full"
            required
            onChange={(e: any) =>
              handleChangeEtapaField(etapa, "plazoDiasMaximo", e?.target?.value)
            }
            value={etapa?.plazoDiasMaximo}
            // isInvalid={!!errors[crearLlamadoFormFields.referencia]?.message}
            // inputFormName={crearLlamadoFormFields.referencia}
          />
          <Input
            label="Puntaje minimo"
            placeholder="Ingrese un puntaje minimo"
            type="number"
            className="flex-grow w-full"
            required
            onChange={(e: any) =>
              handleChangeEtapaField(etapa, "puntajeMinimo", e?.target?.value)
            }
            value={etapa?.puntajeMinimo}
            // isInvalid={!!errors[crearLlamadoFormFields.referencia]?.message}
            // inputFormName={crearLlamadoFormFields.referencia}
          />
          <Cell className="pl-4">
            <Text className="!text-[20px]" text={`Total: ${sumOfSubetapas}`} />
          </Cell>
        </Row>
        <div className="w-full">
          {
            Number(sumOfSubetapas) < Number(etapa?.puntajeMinimo) &&
            <OneLineError message={"La suma de las subetapas debe ser mayor a el minimo de esta etapa"} />
          }
        </div>
        <SectionTitle>Subetapas</SectionTitle>
        <SubEtapaList
          setSubEtapas={(values: any) =>
            handleSetSubetapas(etapa?.index, values)
          }
          subetapas={etapa?.subetapas}
        />
      </Container>
    );
  });
};

export default EtapasList;
