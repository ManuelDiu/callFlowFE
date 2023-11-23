import styled from "styled-components";
import tw from "twin.macro";
import { IoMdTime } from "react-icons/io";
import { HistorialLlamado } from "types/llamado";
import Button from "../Buttons/Button";
import { useMutation } from "@apollo/client";
import {
  cambiarCambioLlamado,
  getLlamadoInfoById,
} from "@/controllers/llamadoController";
import { useGlobal } from "@/hooks/useGlobal";
import { useEffect } from "react";
import toast from "react-hot-toast";
const moment = require('moment');
require('moment/locale/es');
const HtmlToReactParser = require('html-to-react').Parser;
const htmlParser = new HtmlToReactParser();

moment.locale("es");

const Container = styled.div`
  ${tw`w-full h-auto flex flex-col gap-5 items-center justify-start`}
`;

const ItemHistorial = styled.div`
  ${tw`w-full h-auto flex flex-row flex-wrap max-w-full items-center justify-start relative gap-3 px-6 py-8`}
`;

const TimeText = styled.div`
  ${tw`text-[#767676] min-w-fit flex flex-wrap text-base font-medium flex flex-row items-center justify-start gap-5`}
`;

const ItemLine = styled.div`
  ${tw`w-[24px] h-[2px] rounded-full bg-[#020202]`}
`;

const Text = styled.span`
  ${tw`w-full h-auto flex flex-grow text-left flex-grow min-w-fit items-center flex-wrap justify-start`}
`;

const ContentDia = styled.div`
  ${tw`w-full h-auto flex flex-grow flex-col items-center justify-start gap-4`}
`;

const LineItem = styled.div`
  ${tw`w-full h-auto flex flex-grow flex-row items-center justify-center gap-4`}
`;

const Line = styled.div`
  ${tw`w-full flex-grow flex h-[2px] rounded-full bg-gray-200`}
`;

const ActionsContainer = styled.div`
  ${tw`w-full flex-grow h-auto flex flex-col items-end justify-center gap-4`}
`;

const BadgeText = styled.div<{isSuccess: boolean}>`
  ${tw`text-sm font-medium px-4 py-1 rounded-lg transition-all absolute right-4 top-4`}
  ${({ isSuccess }) => isSuccess ? tw`!bg-modalButtons-green text-white` : tw`bg-[#ffa5a3] text-[##fa0500]`}
`;

interface Props {
  historiales: HistorialLlamado[];
  llamadoId?: Number;
}

const HistorialLlamadoComp = ({ historiales }: Props) => {

  const [cambiarCambioHistorialItem, { loading }] =
    useMutation(cambiarCambioLlamado);
  const { handleSetLoading } = useGlobal();

  const formatHistoriales = historiales?.map((item) => {
    return {
      ...item,
      fecha: moment(Number(item?.createdAt)).fromNow(),
    };
  })?.sort((itemA, itemB) => {
    if (moment(itemA?.createdAt).isAfter(moment(itemB?.createdAt))) {
      return 1;
    } else {
      return -1;
    }
  });

  useEffect(() => {
    handleSetLoading(loading);
  }, [loading]);

  const datosPorDia = {} as any;

  // Iterar sobre cada objeto y agruparlo por día
  formatHistoriales.forEach((item) => {
    const fechaMoment = moment(Number(item.createdAt));
    const fecha = fechaMoment.format("DD/MM/YYYY");
    if (!datosPorDia[fecha]) {
      datosPorDia[fecha] = [item];
    } else {
      datosPorDia[fecha] = [...datosPorDia[fecha], item];
    }
  });

  const orderDatosPorDia = Object.keys(datosPorDia || {})?.sort(
    (itemA: any, itemB: any) => {
      if (moment(itemA).isAfter(moment(itemB))) {
        return -1;
      } else {
        return 1;
      }
    }
  );

  const handleToggleItem = async (item: HistorialLlamado, accept: boolean) => {
    // enviar al back
    try {
      const dataToSend = {
        historialItemId: item?.id,
        cambioId: item?.cambio?.id,
        accept: accept,
      };
      const resp = await cambiarCambioHistorialItem({
        variables: {
          info: dataToSend,
        },
        refetchQueries: [
          {
            query: getLlamadoInfoById,
            variables: {
              llamadoId: Number(item?.llamado?.id),
            },
          },
        ],
      });
      if (resp?.data?.cambiarCambioLlamado?.ok) {
        toast.success("Estado actualizado correctamente");
      } else {
        toast.error("Error al actualizar estado");
      }
    } catch (error: any) {
      toast.success(error?.message || "Error al actualizar estado");
    }
  };

  return (
    <Container>
      {orderDatosPorDia?.map((dia) => {
        return (
          <ContentDia key={dia}>
            <LineItem>
              <Line />
              <span className="text-base font-medium text-gray-500">{dia}</span>
              <Line />
            </LineItem>
            {datosPorDia[dia]?.map((item: any) => {
              return (
                <ItemHistorial key={item?.id}>
                  <IoMdTime className="min-w-fit" color="#A3AED0" size={24} />
                  <TimeText>
                    <span>{item?.fecha}</span>
                    <ItemLine />
                  </TimeText>
                  <Text>{htmlParser.parse(item?.descripcion)}</Text>
                  {item?.cambio && (item?.cambio?.cambio === null || item?.cambio?.cambio === undefined) && (
                    <ActionsContainer>
                      <Button
                        action={() => handleToggleItem(item, true)}
                        className="!w-[140px]"
                        text=" Aceptar"
                        variant="green"
                        rounded="large"
                      />
                      <Button
                        action={() => handleToggleItem(item, false)}
                        className="!w-[140px]"
                        text="Cancelar"
                        variant="red"
                        rounded="large"
                      />
                    </ActionsContainer>
                  )}
                  {
                    item?.cambio && (item?.cambio?.cambio !== null && item?.cambio?.cambio !== undefined) && <BadgeText isSuccess={item?.cambio?.cambio === true}>
                      {
                        item?.cambio?.cambio ? "Aceptado" : "Rechazado"
                      }
                    </BadgeText>
                  }
                </ItemHistorial>
              );
            })}
          </ContentDia>
        );
      })}
    </Container>
  );
};

export default HistorialLlamadoComp;
