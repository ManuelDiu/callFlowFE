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
    tiposArchivo: () => "/tipos-archivo",
    llamadoInfo: (llamadoId: any) => `/llamados/${llamadoId}/info`,
    agregarLlamado: () => `/llamados/agregar-llamado`,
    agregarTemplate: () => `/template/agregar-template`,
    selectTemplate: () => `/llamados/select-template`,
    templates: () => `/template`,
    postulantes: () => `/postulantes`,
    modificarInfoPerfil: () => `/perfil/modificar-informacion`,
    llamadoInfoPage: (llamadoId?: any) => `/llamados/${llamadoId ? llamadoId : `[llamadoId]`}/info`,
    postulanteInLlamadoInfo: (llamadoId?: any, postulanteId?: any) => `/llamados/${llamadoId ? llamadoId : '[llamadoId]'}/postulante/${postulanteId ? postulanteId : `[postulanteId]`}`,
}

export default appRoutes;