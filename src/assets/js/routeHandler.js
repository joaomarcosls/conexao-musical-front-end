/*
Função que verifica o nível de acesso do usuário
e redireciona para a rota com o prefixo correto.
*/
export default function routeHandler(route) {
    let routeName = route;
    const accessLevel = window.sessionStorage.getItem('access_level');

    if (accessLevel === 'Administrador') {
      routeName = '/a' + route;
    }
    if (accessLevel === 'Usuário') {
      routeName = '/u' + route;
    }
    return routeName;
};
