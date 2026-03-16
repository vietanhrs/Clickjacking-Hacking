export const environment = {
  production: true,
  apiUrl: 'http://localhost:8080/api/account',
  scenarios: {
    law:    { targetUrl: 'https://law.vnu.edu.vn/Login.aspx',        redirectUrl: 'https://law.vnu.edu.vn/Login.aspx' },
    office: { targetUrl: 'http://112.137.142.21/qlvb/login/',        redirectUrl: 'http://112.137.142.21/qlvb/login/' },
    net:    { targetUrl: 'http://112.137.142.19',                    redirectUrl: 'http://112.137.142.19' },
  },
};
