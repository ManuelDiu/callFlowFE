const appRoutes = {
    login: () => "/auth/login",
    register: () => "/auth/register",
    home: () => "/",
    llamados: () => "/llamados",
    usuarios: () => "/usuarios",
    categorias: () => "/categorias",
    crearLlamado: () => "/llamados/crear-llamado",
    resetPassword: () => "/reset-password",
    forgetPassword: () => "/forget-password",
    llamadoInfo: (llamadoId: any) => `/llamados/${llamadoId}/info`,
    agregarLlamado: () => `/llamados/agregar-llamado`,
    postulantes: () => `postulantes`
}

export default appRoutes;