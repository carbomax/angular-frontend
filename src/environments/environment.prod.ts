export const environment = {
  production: true,
  URI_ROOT: 'https://dev.pepeganga-api.com/pepeganga',
  URI_MELI: `http://auth.mercadolibre.com.uy/authorization?response_type=code&client_id=3756313271086728&state=${Math.floor(Math.random() * 100)}&redirect_uri=https://pepeganga-dropshipping-ca5f0.web.app/home/meli-accounts`,
  URI_MELI_PUBLIC: 'https://api.mercadolibre.com',
  URI_RESET_PASS: 'https://pepeganga-dropshipping-ca5f0.web.app/auth/reset',
  URI_UPLOAD_BUCKET: 'https://dev.pepeganga-api.com/pepeganga/upload/api/bucket/download-file-from-upload-bucket?pathFile='
};
