import { FullLlamadoInfo } from "types/llamado";
import { useEffect, useRef, useState } from "react";
import generatePDF from "react-to-pdf";
import { useMutation, useQuery } from "@apollo/client";
import {
  getLlamadoInfoById,
  puntajesLlamado,
} from "@/controllers/llamadoController";
import Button from "../Buttons/Button";
import { toast } from "react-toastify";
import useUploadImage from "@/hooks/useUploadImage";
import { useGlobal } from "@/hooks/useGlobal";
import { addArchivoFirmaToLlamado } from "@/controllers/archivoController";
import styled from "styled-components";
import tw from "twin.macro";
import Table from "../Table/Table";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { ColumnItem } from "types/table";
import { EstadoPostulanteEnum } from "@/enums/EstadoPostulanteEnum";
import NotFoundImage from "@/public/images/NotFound.svg";
import Text from "../Table/components/Text";

// TODO: DE USO TEMPORAL, traer mínimo o settear uno global para eliminarla.
const MINIMO_LLAMADO_GLOBAL: number = 60;

interface Props {
  llamadoInfo: FullLlamadoInfo;
}

const HeaderRow = styled.div`
  ${tw`hidden w-full transition-all px-4 border-b-2 border-borders2 w-fit min-w-full h-auto py-2 md:flex flex-row items-center justify-center gap-x-2 bg-white`}
`;

const ColItem = styled.div`
  ${tw`w-full transition-all gap-2 flex flex-row items-center justify-start flex-grow h-auto max-h-[50px] h-[50px]`}
`;

const ColTitle = styled.span`
  ${tw`text-textogris text-sm font-semibold transition-all`}
`;

const Content = styled.div`
  ${tw`w-full transition-all max-h-full overflow-auto px-4 h-auto flex flex-col items-center justify-start`}
`;

const Row = styled.div<{ cumple: boolean | undefined }>`
  ${tw`divide-y md:divide-none divide-slate-200 w-full py-4 transition-all px-2 rounded-md flex flex-col md:flex-row max-w-full items-center md:items-start py-4 border`}
  ${({ cumple = false }) => (cumple ? tw`border-green` : tw`border-red-500`)}
`;

const Cell = styled.div`
  ${tw`w-full h-full gap-y-1 transition-all flex flex-col max-w-full overflow-clip bg-transparent ml-2 justify-center`}
`;

const UnderlinedText = styled.span<{ cumpleminimo: boolean | undefined }>`
  ${tw`underline ml-2`}
  ${({ cumpleminimo = false }) =>
    cumpleminimo ? tw`decoration-green` : tw`decoration-red-500`}
`;

const PostulantesResumen = ({ llamadoInfo }: Props) => {
  const targetRef = useRef<any>();

  const { data: info, loading } = useQuery(puntajesLlamado, {
    variables: {
      llamadoId: llamadoInfo?.id,
    },
    fetchPolicy: "no-cache",
  });

  if (loading) {
    return;
  }

  const puntajes = info?.listarPuntajesPostulantes || [];

  const colsEtapas: ColumnItem[] = llamadoInfo?.etapas?.map((etapa) => {
    return {
      title: etapa.nombre,
      icon: <AiOutlineInfoCircle color="#A3AED0" size={20} />,
      key: etapa.nombre.toLowerCase().trim(),
    } as ColumnItem;
  });
  const cols: ColumnItem[] = [
    {
      title: "Postulante",
      icon: <AiOutlineInfoCircle color="#A3AED0" size={20} />,
      key: "postulante",
    },
    ...colsEtapas,
    {
      title: "Total en el Llamado",
      icon: <AiOutlineInfoCircle color="#A3AED0" size={20} />,
      key: "total",
    },
  ];

  const postulantesFiltered = llamadoInfo?.postulantes?.filter(
    (postul) =>
      postul.estadoActual.nombre === EstadoPostulanteEnum.cumpleRequisito
  );

  const posutlantes = postulantesFiltered
    ?.map((item, index) => {
      let sumTotal = 0;
      const puntajesOfThisPostulante =
        puntajes?.find(
          (puntaje: any) => puntaje?.postulanteId == item?.postulante?.id
        )?.requisitos || [];

      const etapasData = llamadoInfo?.etapas?.map((etapa) => {
        const etapaNombre = etapa.nombre.toLowerCase().trim();
        let totalEtapa = 0;
        const subetapasData = etapa?.subetapas?.map((subetapa) => {
          let sumOfThisSubetapa = 0;
          subetapa?.requisitos?.map((reqItem: any) => {
            const puntajeOfThisReq =
              puntajesOfThisPostulante?.find(
                (requis: any) => requis?.requisitoId === reqItem?.id
              )?.puntaje || 0;
            sumOfThisSubetapa += puntajeOfThisReq;
            totalEtapa += puntajeOfThisReq;
          });
          return {
            nombre: subetapa.nombre,
            total: sumOfThisSubetapa,
          };
        });

        sumTotal += totalEtapa;

        const etapaData = {
          id: etapa.id,
          nombre: etapaNombre,
          minimo: etapa.puntajeMin,
          total: totalEtapa,
          subetapas: subetapasData,
        };

        return etapaData;
      });

      const postulanteData = {
        postulante: item?.postulante,
        etapas: etapasData,
        total: sumTotal,
      };

      return postulanteData;
    })
    .sort((a, b) => b.total - a.total);
  // console.log("data is", data)

  return (
    <div className="w-full h-auto transition-all flex overflow-auto pt-4 pb-4 flex-col gap-3 items-start justify-start bg-white shadow-md rounded-[20px]">
      {/* <Button action={() => handleGenerateGrilla()} text="Descargar" /> */}
      <div
        ref={targetRef}
        className="flex w-full p-5 flex-col items-start justify-start gap-4"
      >
        <span className="text-black font-semibold text-3xl">
          Resumen de los postulantes en el llamado
        </span>
        <HeaderRow>
          {cols?.map((col) => {
            return (
              <ColItem key={col?.key}>
                {col?.icon}
                <ColTitle>{col?.title}</ColTitle>
              </ColItem>
            );
          })}
        </HeaderRow>

        {posutlantes?.length > 0 ? (
          posutlantes.map((item, index) => {
            const cumpleMinimo = item?.total >= MINIMO_LLAMADO_GLOBAL;
            return (
              <Row
                cumple={cumpleMinimo || undefined}
                key={`itemPostulante-${index}`}
              >
                <Cell className="justify-center text-gray-800 font-semibold ">
                  <span className="text-center md:text-start text-xl">{`${item?.postulante.nombres} ${item?.postulante.apellidos} - ${item?.postulante?.documento}`}</span>
                </Cell>

                {item?.etapas?.map((etapa) => {
                  const cumpleMinimoEtapa = etapa.total >= etapa.minimo;
                  return (
                    <Cell key={`etapaId-${etapa?.id}`} className="pt-2">
                      <span className="text-sm">
                        Subetapas de {etapa.nombre}:
                      </span>
                      <div className="w-max h-full flex flex-col items-start justify-start gap-y-1 border-l-2 rounded-md border-principal/30 pl-2">
                        {etapa?.subetapas?.map((subetapa) => {
                          return (
                            <div
                              key={`subetapa-${subetapa?.nombre}`}
                              className="w-full flex flex-col items-start gap-4 justify-start"
                            >
                              <div className="flex flex-col">
                                <span className="font-semibold text-textoGray break-words">
                                  {`${subetapa?.nombre}: ${subetapa.total}`}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="my-2 flex flex-row items-center justify-between">
                        <span className="font-semibold text-lg text-gray-800">
                          Total en etapa:
                          <UnderlinedText
                            cumpleminimo={cumpleMinimoEtapa}
                            title={
                              cumpleMinimoEtapa
                                ? "Cumple con el mínimo de la etapa."
                                : "No cumple con el mínimo de la etapa."
                            }
                          >
                            {etapa.total}
                          </UnderlinedText>
                        </span>
                      </div>
                    </Cell>
                  );
                })}
                <Cell className="pt-5 md:text-center self-center md:py-0 font-semibold text-lg text-gray-700">
                  <span className="break-words">
                    Total en el llamado {item.total}
                  </span>
                </Cell>
              </Row>
            );
          })
        ) : (
          <div className="w-full  h-auto flex flex-col items-center py-10 justify-center gap-4">
            <img
              src={NotFoundImage?.src}
              className="object-cover h-[300px] w-auto"
            />
            <Text
              className="!text-[20px] !leading-[24px] h-full!"
              text={
                "No se encontraron postulantes que cumplan con los requisitos."
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PostulantesResumen;
