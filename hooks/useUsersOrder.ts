import { UserList } from "types/usuario";

export function useUsersOrder({ users = [] }: { users?: UserList[] }) {
  const newOrder = users !== undefined ? [...users]?.sort((usrA, usrB) => {
    if (usrA?.activo && !usrB?.activo) {
      return -1;
    } else {
      return 1;
    }
  }) : [];

  return {
    newOrder,
  }
}
