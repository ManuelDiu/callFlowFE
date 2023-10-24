import { useQuery } from "@apollo/client";
import ListOfPostulantes from "../ListOfPostulantes";
import { getPostulantesByLlamadoId } from "@/controllers/postulanteController";
import { PostulanteLlamadoResumed } from "types/postulante";
import { useGlobal } from "@/hooks/useGlobal";
import { useEffect } from "react";
import NotFoundPage from "@/components/NotFoundPage/NotFoundPage";
import { EstadoPostulanteEnum } from "@/enums/EstadoPostulanteEnum";
interface Props {
  title: string;
  postulantes?: any;
  llamadoId: number;
}

const PostulantesListContent = ({ title, postulantes, llamadoId }: Props) => {
  const { data, loading } = useQuery<{
    getPostulantesByLlamadoId: PostulanteLlamadoResumed[];
  }>(getPostulantesByLlamadoId, {
    variables: {
      llamadoId: llamadoId,
    },
  });
  const { handleSetLoading } = useGlobal();

  const isLoading = loading;
  const postulantesFound = data?.getPostulantesByLlamadoId;
  const postulantesCumpliendoRequisitos = postulantesFound?.filter(
    (postul) =>
      postul.estadoActual.nombre === EstadoPostulanteEnum.cumpleRequisito
  );

  useEffect(() => {
    handleSetLoading(loading);
  }, [loading]);

  if (isLoading) {
    return null;
  }

  return (
    <>
      <ListOfPostulantes
        title={title}
        selectedUsers={postulantes}
        postulantesLlamadoFound={postulantesCumpliendoRequisitos}
        llamadoId={llamadoId}
        showCurrEtapa
      />
    </>
  );
};

export default PostulantesListContent;
