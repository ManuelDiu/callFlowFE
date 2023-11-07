import { FullLlamadoInfo } from "types/llamado";
import { useEffect, useRef, useState } from "react";
import generatePDF from "react-to-pdf";
import { useMutation, useQuery } from "@apollo/client";
import {
  getLlamadoInfoById,
  puntajesLlamado,
} from "@/controllers/llamadoController";
import Button from "../Buttons/Button";
import toast from "react-hot-toast";
import useUploadImage from "@/hooks/useUploadImage";
import { useGlobal } from "@/hooks/useGlobal";
import { addArchivoFirmaToLlamado } from "@/controllers/archivoController";
import clsx from "clsx";

interface Props {
  llamadoInfo: FullLlamadoInfo;
}

const GrillaPDF = ({ llamadoInfo }: Props) => {
  const targetRef = useRef<any>();
  const { handleUpload } = useUploadImage({ folder: "grillas" });
  const { handleSetLoading } = useGlobal();
  const [handleAddFile] = useMutation(addArchivoFirmaToLlamado);

  const { data: info, loading } = useQuery(puntajesLlamado, {
    variables: {
      llamadoId: llamadoInfo?.id,
    },
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    // if (targetRef?.current) {
    //     generatePDF(targetRef, { filename: "grilla.pdf" })
    // }
  }, [targetRef]);

  if (loading) {
    return;
  }

  const puntajes = info?.listarPuntajesPostulantes || [];

  const handleGenerateGrilla = async () => {
    try {
      handleSetLoading(true);
      const file = await generatePDF(targetRef, { filename: "grilla.pdf" });

      const pdfData = file.output("arraybuffer");
      const pdfBlob = new Blob([pdfData], { type: "application/pdf" });
      const pdfFile = new File(
        [pdfBlob],
        `Grilla-${llamadoInfo?.id}${new Date().toString()}.pdf`,
        { type: "application/pdf" }
      );
      if (pdfFile) {
        const urlFile = await handleUpload(pdfFile);
        const dataToSend = {
          nombre: "Grilla",
          url: urlFile,
          extension: "pdf",
          llamadoId: Number(llamadoInfo?.id || 0),
        };
        const resp = await handleAddFile({
          variables: {
            dataFile: dataToSend,
          },
          refetchQueries: [
            {
              query: getLlamadoInfoById,
              variables: {
                llamadoId: Number(llamadoInfo?.id),
              },
            },
          ],
        });

        if (resp?.data?.addArchivoFirmaToLlamado?.ok) {
          toast.success(
            "Grilla generada correctamente, se envio un email a todos los miembros del tribunal para que firmen la misma"
          );
        } else {
          throw new Error(
            resp?.data?.addArchivoFirmaToLlamado?.message ||
              "Error generando archivo"
          );
        }
      } else {
        toast.error("Error generando grilla");
      }
      handleSetLoading(false);
    } catch (error: any) {
      toast.error(error?.message);
      handleSetLoading(false);
    }
  };

  const postulantesSort = llamadoInfo?.postulantes?.sort((postA, postB) => {
    const puntajeThiPostA = puntajes?.find(
      (puntaje: any) => puntaje?.postulanteId == postA?.postulante?.id
    );
    let sumRequisitosA = 0;
    puntajeThiPostA?.requisitos?.map((req: any) => {
      sumRequisitosA += req?.puntaje || 0;
    });

    const puntajeThiPostB = puntajes?.find(
      (puntaje: any) => puntaje?.postulanteId == postB?.postulante?.id
    );
    let sumRequisitosB = 0;
    puntajeThiPostB?.requisitos?.map((req: any) => {
      sumRequisitosB += req?.puntaje || 0;
    });

    if (sumRequisitosA > sumRequisitosB) {
      return -1;
    } else {
      return 1;
    }
  });

  return (
    <div className="w-full h-auto max-h-full overflow-auto">
      <Button action={() => handleGenerateGrilla()} text="Descargar" />
      <div
        ref={targetRef}
        style={{ pageBreakBefore: 'always' }}
        className="flex md:px-10 px-0 md:py-10 py-4 flex-col items-start justify-start gap-4"
      >
        <span className="text-black font-semibold text-3xl">
          Grilla del llamado
        </span>

        <span className="text-base font-medium">
          Nombre: {llamadoInfo.nombre}
        </span>
        <span className="text-base font-medium">
          Cupos: {llamadoInfo.cupos}
        </span>
        <span className="text-base font-medium">
          Postulantes: {llamadoInfo?.postulantes?.length || 0}
        </span>
        <span className="text-base font-medium">
          Etapas: {llamadoInfo?.etapas?.length}
        </span>
        <span className="text-base font-medium">
          Miembros: {llamadoInfo?.miembrosTribunal?.length}
        </span>

        <span className="text-base mt-10 text-[20px] font-semibold">
          Postulantes:{" "}
        </span>

        {postulantesSort?.map((item, index) => {
          let sumTotal = 0;
          const puntajeThiPost = puntajes?.find(
            (puntaje: any) => puntaje?.postulanteId == item?.postulante?.id
          );
          if (
            puntajeThiPost == null ||
            typeof puntajeThiPost === "undefined" ||
            !puntajeThiPost
          ) {
            return;
          }
          const puntajesOfThisPostulante = puntajeThiPost?.requisitos || [];

          return (
            <div
              style={{ pageBreakBefore: 'avoid' }}
              key={`itemPostulante-${index}`}
              className="w-full h-auto flex border flex-col items-start justify-start gap-5 p-5 rounded-2xl border-gray-400 shadow-md"
            >
              <span className="text-gray-800 pb-4 border-b border-b-gray-400 w-full text-center font-semibold text-2xl">
                {item?.postulante?.nombres} {item?.postulante?.apellidos} -{" "}
                {item?.postulante?.documento}
              </span>

              {llamadoInfo?.etapas?.map((etapa) => {
                let totalEtapa = 0;
                etapa?.subetapas?.map((itm) => {
                  itm?.requisitos?.map((item: any) => {
                    const puntajeOfThisReq =
                      puntajesOfThisPostulante?.find(
                        (requis: any) => requis?.requisitoId === item?.id
                      )?.puntaje || 0;
                    totalEtapa += puntajeOfThisReq;
                  });
                });
                sumTotal += totalEtapa;

                return (
                  <div
                    className="flex w-full flex-col border-l border-l-gray-300 items-start justify-start gap-4 pl-4"
                    key={`etapaId-${etapa?.id}`}
                  >
                    <div className="flex w-full flex-row items-center justify-between">
                      <span className="font-semibold text-lg text-gray-800">
                        Etapa - {etapa?.nombre}
                      </span>
                    </div>
                    <div className="w-full h-auto flex flex-row items-start justify-start gap-4 pl-4">
                      {etapa?.subetapas?.map((subetapa) => {
                        let sumOfThisSubetapa = 0;
                        subetapa?.requisitos?.map((item: any) => {
                          const puntajeOfThisReq =
                            puntajesOfThisPostulante?.find(
                              (requis: any) => requis?.requisitoId === item?.id
                            )?.puntaje || 0;
                          sumOfThisSubetapa += puntajeOfThisReq;
                        });

                        return (
                          <div
                            key={`subetapa-${subetapa?.nombre}`}
                            className="flex border-l border-l-gray-300 pl-4 w-full flex-col items-start gap-4 justify-start"
                          >
                            <div className="w-full h-auto flex flex-row items-center justify-between">
                              <span className="text-lg font-semibold text-gray-800">
                                Subetapa - {subetapa?.nombre}
                              </span>
                            </div>
                            <div className="w-full h-auto flex flex-col items-start justify-start gap-2 pl-5">
                              {subetapa?.requisitos?.map((req: any) => {
                                const puntajeOfThisReq =
                                  puntajesOfThisPostulante?.find(
                                    (requis: any) =>
                                      requis?.requisitoId === req?.id
                                  )?.puntaje || 0;
                                return (
                                  <div
                                    key={req?.nombre}
                                    className="w-full border-l-gray-300 pl-4 border-l h-auto flex flex-row items-center justify-start"
                                  >
                                    <span className="font-normal text-gray-500">
                                      Requisito - {req?.nombre}:{" "}
                                      {puntajeOfThisReq}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                            <span className="text-lg font-semibold text-gray-800">
                              Total subetapa: {sumOfThisSubetapa}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <span className="font-semibold text-[18px] text-gray-800">
                      Total etapa: {totalEtapa}
                    </span>
                  </div>
                );
              })}
              <span className="font-semibold text-lg text-gray-700">
                Puntaje alcanzado total:{" "}
                <span
                  className={clsx(
                    "border-b-2",
                    sumTotal > 60 ? "border-green" : "border-red-300"
                  )}
                >
                  {sumTotal}
                </span>
              </span>
            </div>
          );
        })}
        {llamadoInfo?.postulantes?.length === 0 && (
          <span>
            {
              "El llamado no tiene ningun postulantes, o estos no estan en estado 'Cumple Requisitos'"
            }
          </span>
        )}
      </div>
    </div>
  );
};

export default GrillaPDF;
