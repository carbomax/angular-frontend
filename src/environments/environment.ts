// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  URI_ROOT: 'http://localhost:9999/pepeganga',
  URI_MELI: `http://auth.mercadolibre.com.uy/authorization?response_type=code&client_id=5381382874135569&state=${Math.floor(Math.random() * 100)}&redirect_uri=https://localhost:4200/home/meli-accounts`,
  URI_MELI_PUBLIC: 'https://api.mercadolibre.com',
  URI_RESET_PASS: 'https://localhost:4200/auth/reset'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
