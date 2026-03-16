// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/account',
  scenarios: {
    law:    { targetUrl: 'https://law.vnu.edu.vn/Login.aspx',        redirectUrl: 'https://law.vnu.edu.vn/Login.aspx' },
    office: { targetUrl: 'http://112.137.142.21/qlvb/login/',        redirectUrl: 'http://112.137.142.21/qlvb/login/' },
    net:    { targetUrl: 'http://112.137.142.19',                    redirectUrl: 'http://112.137.142.19' },
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
