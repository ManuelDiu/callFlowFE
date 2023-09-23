import { useRouter } from "next/router";

export const useRouterPath = (): string => {
    const router = useRouter();
    const route = router.pathname;
    return route;
};