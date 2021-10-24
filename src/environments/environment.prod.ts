const parsedUrl = new URL(window.location.href);
const baseUrl = parsedUrl.origin;
export const environment = {
  production: true,
  JocataServer: baseUrl + '/APIGateway/'
  // JocataServer: 'http://172.17.251.201:2020' + '/APIGateway/'
    // JocataServer: 'https://103.224.109.86' + '/APIGateway/'


};
