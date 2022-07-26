import axios from 'axios';

const url = process.env.MIX_API_URL;

function getHeader() {
  return {
    Authorization: 'Bearer ' + localStorage.getItem('token'),
    'Content-Type': 'application/json',
  };
}

export function get(endpoint) {
  return axios.get(url + endpoint, {
    headers: getHeader(),
  });
}

export function put(endpoint, body) {
  return axios.put(url + endpoint, body, {
    headers: getHeader(),
  });
}

export function post(endpoint, body) {
  return axios.post(url + endpoint, body, {
    headers: getHeader(),
  });
}

export function del(endpoint) {
  return axios.delete(url + endpoint, {
    headers: getHeader(),
  });
}

export function patch(endpoint, body) {
  return axios.patch(url + endpoint, body, {
    headers: getHeader(),
  });
}
