export function postParams(body: any) {
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
}

export const getData = async (url: string) => {
  const response = await fetch(url);
  try {
    const json = await response.json();
    return json;
  } catch {
    return null;
  }
};

export const getBlob = async (url: string) => {
  let response;
  try {
    response = await fetch(url);
  } catch {
    return null;
  }
  const blob = await response.blob();
  return blob;

};

export const post = async (url: string, body: any) => {
  // @ts-ignore
  const response = await fetch(url, postParams(body));
  try {
    const json = await response.json();
    return json;
  } catch {
    return null;
  }
}

export const page = (start: number, limit: number) => `start=${start}&limit=${limit}`;
