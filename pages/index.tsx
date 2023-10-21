import type { NextPage } from "next";
import Head from "next/head";
import styled from "styled-components";
import tw from "twin.macro";
import Notification from "@/components/Notification/Notification";
import Breadcrumb from "@/components/Topbar/Breadcrumb";
import ProfileBar from "@/components/Topbar/ProfileBar";
import { IoMdStats } from "react-icons/io";
import StatCard from "@/components/Card/StatCard";
import {
  chartData,
  chartOptions,
  cols,
  llamadosRecientes,
  postulantesRecientes,
} from "@/utils/dashboard";
import Table from "@/components/Table/Table";
import Text from "@/components/Table/components/Text";
import { Chart } from "react-google-charts";
import Button from "@/components/Buttons/Button";
import { BiPlus } from "react-icons/bi";
import { useRouter } from "next/router";
import appRoutes from "@/routes/appRoutes";
import Dropdown from "@/components/Inputs/Dropdown";
import { ChangeEvent, useEffect, useState } from "react";
import { ITR } from "@/enums/ITR";
import Modal from "@/components/Modal/Modal";
import Input from "@/components/Inputs/Input";
import { useLazyQuery, useQuery } from "@apollo/client";
import { getEstadisticas } from "@/controllers/llamadoController";
import { useGlobal } from "@/hooks/useGlobal";
import { EstadisticasGet } from "types/llamado";
import { formatLlamadosToTable } from "@/utils/llamadoUtils";
import Image from "next/image";
import { DEFAULT_USER_IMAGE } from "@/utils/userUtils";
import moment from "moment";

const Topbar = styled.div`
  ${tw`flex justify-between p-5 w-full h-max`}
`;
const MainContainer = styled.div`
  ${tw`flex flex-col gap-3 px-5 items-center justify-start w-full h-auto `}
`;
const FilterContainer = styled.div`
  ${tw`flex items-center justify-between w-full h-auto `}
`;
const Statistics = styled.div`
  ${tw`flex justify-between gap-x-7 gap-y-2 w-full flex-wrap lg:flex-nowrap h-auto `}
`;
const TableContainer = styled.div`
  ${tw`w-full h-auto flex flex-col items-center justify-start`}
`;
const BottomSection = styled.div`
  ${tw`flex flex-wrap 2xl:flex-nowrap gap-5 w-full mb-5 rounded-3xl  `}
`;
const ChartWrapper = styled.div`
  ${tw`flex flex-col items-start w-full 2xl:w-1/2 p-5 bg-white rounded-3xl shadow-md `}
`;
const PostulantesContainer = styled.div`
  ${tw`flex flex-col p-5 gap-2 w-full bg-white rounded-3xl shadow-md `}
`;

const Home: NextPage = () => {
  const router = useRouter();
  const [selectedITR, setSelectedITR] = useState<string>();
  const [selectedMeses, setSelectedMeses] = useState<string>("3");
  const { handleSetLoading } = useGlobal();
  const [data, setData] = useState<EstadisticasGet | undefined>(undefined);

  // El siguiente codigo es a modo de prueba del proceso de firma, luego eliminar.
  const [showFirmarModal, setShowFirmarModal] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [_, { loading: loadingEstadisticas, refetch }] =
    useLazyQuery(getEstadisticas, {
      fetchPolicy: 'no-cache',
      variables: {
        itr: selectedITR === "Todos" || !selectedITR ? "" : selectedITR,
        meses: selectedMeses,
      }
    });


  const handleLoadEstadisticas = async () => {
    const resp = await refetch({
      variables: {
        itr: selectedITR === "Todos" || !selectedITR ? "" : selectedITR,
      }
    });
    const info = resp?.data?.listarEstadisticas as EstadisticasGet;
    if (info) {
      setData(info)
    }
  }

  useEffect(() => {
    handleLoadEstadisticas();
  }, [selectedITR, selectedMeses]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setSelectedFile(file);
    }
  };

  const firmarDocumento = () => {
    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const binaryData = event.target?.result as ArrayBuffer;

        const formData = new FormData();
        formData.append("file", new Blob([binaryData]));

        // Crear un objeto de opciones para la solicitud fetch
        const requestOptions: RequestInit = {
          method: "POST",
          body: formData,
          headers: {
            "Content-Disposition":
              /*`"${selectedFile.name}"`*/ "archivoAFirmar",
          },
        };

        // Realizar la solicitud fetch con las opciones personalizadas
        fetch("https://firma.gub.uy/pp/api/externos/archivo", requestOptions)
          .then((response) => response.json())
          .then((data) => {
            // Hacer algo con la respuesta de la API
          })
          .catch((error) => {
            // Manejar errores
            console.log("ERROR> ", error);
            console.log("file on ERROR> ", selectedFile);
          });
      };

      reader.readAsArrayBuffer(selectedFile);
    }
  };

  useEffect(() => {
    handleSetLoading(loadingEstadisticas);
  }, [loadingEstadisticas]);

  const formatLlamadosTableInfo = formatLlamadosToTable(data?.llamadosRecientes || []);

  const formatCantidadCargos = (data?.cantidadCargos || [])?.map((item) => {
    return [item?.nombre, item?.cantidad]
  })

  return (
    <>
      <Head>
        <title>Inicio</title>
        <meta name="description" content="Dashboard de la aplicación." />
      </Head>
      <Topbar>
        <Breadcrumb title="Dashboard" />
        <ProfileBar />
      </Topbar>
      <MainContainer>
        {showFirmarModal && (
          <Modal
            title="Firmar Archivo"
            setOpen={setShowFirmarModal}
            textok="Guardar"
            onSubmit={firmarDocumento}
            content={
              <div className="">
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
              </div>
            }
          />
        )}
        {/* <Notification
          title="¡Acción requerida!"
          text="El miembro del tribunal Jael cambió el estado del postulante Manuel de “No Cumple Requisitos“ a “Cumple Requisitos“ en el llamado “Llamado Pasantes UTEC”"
          time={"hace 3 días"}
          usesButtons
        /> */}
        <FilterContainer>
          <div className="max-w-full truncate flex flex-col">
          <h3 className="text-texto font-semibold">Estadísticas</h3>
          <span className="text-sm text-textogris">
            Esta informacion es de los ultimos 3 meses, puedes cambiarlo <br />
            en el siguiente filtro
          </span>
          </div>
          <div className="w-fit flex flex-row gap-4">
            <Dropdown
              placeholder="Filtrar por ITR"
              defaultValue={['Todos']}
              onChange={(val: any) => setSelectedITR(val?.value)}
              items={[
                { label: "(Todos)", value: "Todos" },
                { label: "Suroeste", value: ITR.suroeste },
                { label: "Este", value: ITR.este },
                { label: "Norte", value: ITR.norte },
                { label: "Centro Sur", value: ITR.centrosur },
              ]}
            />
           <Dropdown
              placeholder="Cantidad de meses"
              defaultValue={['3']}
              onChange={(val: any) => setSelectedMeses(val?.value)}
              items={[
                { label: "1 mes", value: "1" },
                { label: "3 meses", value: "3" },
                { label: "6 meses", value: "6" },
                { label: "12 meses", value: "12" },
              ]}
            />
          </div>
          
        </FilterContainer>
        <Statistics>
          <StatCard
            title="Llamados en Proceso"
            content={data?.llamadosEnProceso}
            icon={<IoMdStats className="text-principal" size={24} />}
          />
          <StatCard
            title="Llamados Finalizados"
            content={data?.llamadosFinalizados}
            icon={<IoMdStats className="text-principal" size={24} />}
          />
          <StatCard
            title="Nuevos postulantes"
            content={data?.nuevosPostulantes}
            icon={<IoMdStats className="text-principal" size={24} />}
          />
        </Statistics>
        <TableContainer>
          <Table
            title="Llamados recientes"
            cols={cols}
            data={formatLlamadosTableInfo}
            others={
              <div className="flex justify-center w-full">
                <button
                  onClick={() => router.push(appRoutes.llamados())}
                  className="font-medium text-principal rounded-full px-4 py-1 bg-principal/5"
                >
                  Ver más
                </button>
              </div>
            }
          />
        </TableContainer>
        <BottomSection>
          <ChartWrapper>
           <h3 className="text-texto font-semibold">Cargos</h3>
            <Chart
              chartType="PieChart"
              width="100%"
              height="300px"
              data={[
                ["Cargo", "Cantidad de Llamados"],
                ...formatCantidadCargos
              ]}
              options={chartOptions}
            />
          </ChartWrapper>
          <PostulantesContainer>
            <div className="flex items-center justify-between">
              <Text
                text="Postulantes creados recientemente en estos llamados"
                className="text-texto !text-2xl font-bold"
              />
              <Button
                variant="fill"
                icon={<BiPlus size={24} fontWeight={700} color="white" />}
                action={() => null}
                className=""
              />
            </div>
            {data?.postulantesRecientes?.map((postulante: any, index: number) => {
              return (
                <div
                className="flex flex-row items-center justify-start gap-2
                w-full px-5 py-2 rounded-xl bg-white shadow hover:shadow-md transition-all
                "
                key={`postulante-${index}`}
                >
                  <div className="w-10 h-10 relative max-h-[40px] max-w-[40px] min-w-[40px]">
                    <Image src={DEFAULT_USER_IMAGE} layout="fill" objectFit="cover" />
                  </div>
                  <div
                  className=""
                >
                  <span className="font-bold">{postulante?.nombres}</span>
                  <p className="text-sm font-semibold text-textoGray">{moment(postulante?.createdAt).format("DD/MM/yyyy")}</p>
                </div>
                </div>
              );
            })}
          </PostulantesContainer>
        </BottomSection>
      </MainContainer>
    </>
  );
};

export default Home;
