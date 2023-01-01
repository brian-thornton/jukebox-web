export function postParams(body) {
  return {
    method: 'post',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrer: 'no-referrer',
    body: JSON.stringify(body),
  };
};

export const getData = async (url) => {
  const response = await fetch(url);
  try {
    const json = await response.json();
    return json;
  } catch {
    return null;
  }
};

export const getBlob = async (url) => {
  let response;
  try {
    response = await fetch(url);
  } catch {
    return null;
  }
  const blob = await response.blob();
  return blob;

};

export const post = async (url, body) => {
  const response = await fetch(url, postParams(body));
  try {
    const json = await response.json();
    return json;
  } catch {
    return null;
  }
}

export const page = (start, limit) => `start=${start}&limit=${limit}`;
