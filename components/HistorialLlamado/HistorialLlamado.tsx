import styled from "styled-components";
import tw from "twin.macro";
import { IoMdTime } from "react-icons/io";
import { HistorialLlamado } from "types/llamado";
import htmlParser from "html-react-parser";
import moment from "moment";
import Button from "../Buttons/Button";
moment.locale("es");

const Container = styled.div`
  ${tw`w-full h-auto flex flex-col gap-5 items-center justify-start`}
`;

const ItemHistorial = styled.div`
  ${tw`w-full h-auto flex flex-row items-center justify-start gap-3 px-6 py-8`}
`;

const TimeText = styled.div`
  ${tw`text-[#767676] min-w-fit flex flex-wrap text-base font-medium flex flex-row items-center justify-start gap-5`}
`;

const ItemLine = styled.div`
  ${tw`w-[24px] h-[2px] rounded-full bg-[#020202]`}
`;

const Text = styled.span`
  ${tw`w-full h-auto flex flex-grow text-left flex-grow min-w-fit items-center`}
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

interface Props {
  historiales: HistorialLlamado[];
}

const HistorialLlamadoComp = ({ historiales }: Props) => {
  const formatHistoriales = historiales?.map((item) => {
    return {
      ...item,
      fecha: moment(Number(item?.createdAt)).fromNow(),
    };
  });

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
      if (itemA > itemB) {
        return -1;
      } else {
        return 1;
      }
    }
  );

  const handleToggleItem = (item: HistorialLlamado, accept: boolean) => {
    // enviar al back
    const dataToSend = {
      historialItemId: item?.id,
      cambioId: item?.cambio?.id,
    }
  }

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
                  <Text>{htmlParser(item?.descripcion)}</Text>
                  {item?.cambio && !item?.cambio?.cambio && (
                    <ActionsContainer>
                      <Button action={() => handleToggleItem(item, true)} className="w-[200px]" text=" Aceptar" variant="green" rounded="large" />
                      <Button action={() => handleToggleItem(item,false)} className="w-[200px]" text="Cancelar" variant="red" rounded="large" />
                    </ActionsContainer>
                  )}
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
