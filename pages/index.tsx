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
import { useState } from "react";
import { ITR } from "@/enums/ITR";

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
  ${tw`flex items-center w-full 2xl:w-1/2 p-5 bg-white rounded-3xl shadow-md `}
`;
const PostulantesContainer = styled.div`
  ${tw`flex flex-col p-5 gap-2 w-full bg-white rounded-3xl shadow-md `}
`;

const Home: NextPage = () => {
  const router = useRouter();
  const [selectedITR, setSelectedITR] = useState<ITR | [] | "Todos">([]);
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
        <Notification
          title="¡Acción requerida!"
          text="El miembro del tribunal Jael cambió el estado del postulante Manuel de “No Cumple Requisitos“ a “Cumple Requisitos“ en el llamado “Llamado Pasantes UTEC”"
          time={"hace 3 días"}
          usesButtons
        />
        <FilterContainer>
          <h3 className="text-texto font-semibold">Estadísticas</h3>
          <div className="w-60">
            <Dropdown
              placeholder="Filtrar por ITR"
              onChange={(val: any) => setSelectedITR(val?.value)}
              items={[
                { label: "(Todos)", value: "Todos" },
                { label: "Suroeste", value: ITR.suroeste },
                { label: "Este", value: ITR.este },
                { label: "Norte", value: ITR.norte },
                { label: "Centro Sur", value: ITR.centrosur },
              ]}
            />
          </div>
        </FilterContainer>
        <Statistics>
          <StatCard
            title="Llamados en Proceso"
            content={"16"}
            icon={<IoMdStats className="text-principal" size={24} />}
          />
          <StatCard
            title="Llamados Finalizados"
            content={"55"}
            icon={<IoMdStats className="text-principal" size={24} />}
          />
          <StatCard
            title="Nuevos postulantes"
            content={"351"}
            icon={<IoMdStats className="text-principal" size={24} />}
          />
        </Statistics>
        <TableContainer>
          <Table
            title="Llamados recientes"
            cols={cols}
            data={llamadosRecientes}
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
            <Chart
              chartType="PieChart"
              width="100%"
              height="300px"
              data={chartData}
              options={chartOptions}
            />
          </ChartWrapper>
          <PostulantesContainer>
            <div className="flex items-center justify-between">
              <Text
                text="Postulantes creados recientemente"
                className="text-texto !text-2xl font-bold"
              />
              <Button
                variant="fill"
                icon={<BiPlus size={24} fontWeight={700} color="white" />}
                action={() => null}
                className=""
              />
            </div>
            {postulantesRecientes?.map((postulante: any, index: number) => {
              return (
                <div
                  className="flex flex-col w-full px-5 py-2 rounded-xl bg-white shadow hover:shadow-md transition-all"
                  key={`postulante-${index}`}
                >
                  {postulante?.name}
                  {postulante?.createdAt}
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
