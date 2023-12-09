import { PostulanteList } from "types/postulante";
import { DropDownItem } from "./utils";
import UserInfoLine from "@/components/Table/components/UserInfoLine";
import { DEFAULT_USER_IMAGE } from "./userUtils";

export const formatPostulantesToDropdown = (
  postulantes: PostulanteList[] = []
): DropDownItem[] => {
  return postulantes?.map((postulante) => {
    return {
      label: (
        <UserInfoLine
          className="m-2!"
          userImage={DEFAULT_USER_IMAGE}
          userName={`${postulante?.nombres} ${postulante.apellidos}`}
          userlastName={postulante?.documento}
        />
      ),
      searchQuery: `${postulante?.nombres} ${postulante?.apellidos} ${postulante?.documento}`,
      value: postulante.id,
    };
  });
};
