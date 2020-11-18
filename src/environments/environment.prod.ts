export const environment = {
  production: true,
  URI_ROOT: 'https://devhighlevel-lb-1815290972.us-east-2.elb.amazonaws.com/pepeganga',
  URI_MELI: `http://auth.mercadolibre.com.uy/authorization?response_type=code&client_id=3756313271086728&state=${Math.floor(Math.random() * 100)}&redirect_uri=https://pepeganga-d4ce6.web.app/home/meli-accounts`,
  URI_MELI_PUBLIC: 'https://api.mercadolibre.com'
};
