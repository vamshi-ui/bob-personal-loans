// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  hmr: false,
  JocataServer: 'http://192.168.7.42:2020/APIGateway/'
  // JocataServer: 'http://172.17.251.201:2020/APIGateway/'
  // JocataServer: 'https://103.224.109.86/APIGateway/'

};

// const parsedUrl = new URL(window.location.href);
// const baseUrl = parsedUrl.origin;
// export const environment = {
//   production: true,
//   JocataServer: baseUrl + '/APIGateway/',
//   hostIp: 'http://192.168.7.42:82/'
// };

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
