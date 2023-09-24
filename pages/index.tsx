import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styled from "styled-components";
import tw from "twin.macro";
import Notification from "@/components/Notification/Notification";
import Breadcrumb from "@/components/Topbar/Breadcrumb";
import ProfileBar from "@/components/Topbar/ProfileBar";
import { IoMdStats } from "react-icons/io";
import StatCard from "@/components/Card/StatCard";

const Topbar = styled.div`
  ${tw`flex justify-between p-5 w-full h-max`}
`;
const MainContainer = styled.div`
  ${tw`flex flex-col gap-4 px-5 items-center justify-start w-full h-auto `}
`;
const FilterContainer = styled.div`
  ${tw`flex items-center justify-between w-full h-auto `}
`;
const Statistics = styled.div`
  ${tw`flex justify-between gap-7 w-full flex-wrap lg:flex-nowrap h-auto `}
`;
const TableContainer = styled.div`
  ${tw`w-full h-auto px-5 flex flex-col items-center justify-start`}
`;

const Home: NextPage = () => {
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
          text="asdasd"
          time={"hace 3 días"}
          usesButtons
        />
        <FilterContainer>
          <h3 className="self-start text-texto font-semibold">Estadísticas</h3>
          <h3 className="self-start text-texto font-semibold">Combo ITR</h3>
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
        {/* <TableContainer>
          <Table title="Llamados recientes" cols={cols} data={formatUserData} />
        </TableContainer> */}
      </MainContainer>
    </>
  );
};

export default Home;
