import appRoutes from "@/routes/appRoutes";

export const public_routes = [
  appRoutes.login(),
  appRoutes.resetPassword(),
  appRoutes.forgetPassword(),
];


export const tribunal_routes = [
  appRoutes.login(),
  appRoutes.resetPassword(),
  appRoutes.forgetPassword(),
  appRoutes.home(),
  appRoutes.llamados(),
  appRoutes.postulanteInLlamadoInfo(),
  appRoutes.llamadoInfoPage(),
];