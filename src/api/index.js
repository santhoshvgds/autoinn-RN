import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

const getAccessToken = async () => {
  return await AsyncStorage.getItem('token');
};
const setAccessToken = async (token) =>
  await AsyncStorage.setItem('token', token);

let baseUrl;
let platformApi;
(async function () {
  const getvalue = async () => {
    if (!baseUrl) {
      // console.log(baseUrl);
      await AsyncStorage.getItem('domainName')
        .then((domainName) => {
          baseUrl = domainName;
          // baseUrl = 'http://localhost:4000'
          platformApi = axios.create({
            baseURL: baseUrl,
            headers: {
              'content-Type': 'application/json',
            },
          });
          platformApi.interceptors.request.use(async (config) => {
            await getAccessToken().then((token) => {
              if (token) {
                config.headers['x-access-token'] = token;
              }
            });
            return config;
          });
          platformApi.interceptors.response.use(
            (config) => config,
            (error) => {},
          );
          console.log('Done');
        })
        .catch((err) => {
          console.log(err);
        });
      getvalue();
    } else {
      getvalue;
    }
  };

  getvalue();
})();
//   and interceptor comes here
const accessToken = getAccessToken();
export {platformApi, setAccessToken, baseUrl, getAccessToken};
