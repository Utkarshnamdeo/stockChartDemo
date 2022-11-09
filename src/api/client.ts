const getQueryParams = (
  params: Record<string, string | undefined | number> | undefined
) => {
  const queryParams = new URLSearchParams();
  if (params) {
    Object.keys(params).forEach((key) => {
      if (key && params[key]) {
        queryParams.append(key, params[key] as string);
      }
    });
  }
  return queryParams.toString();
};

const client = async ({
  endpoint,
  query,
}: {
  endpoint: string;
  query?: Record<string, string | undefined | number> | undefined;
}) => {
  const headers = { 'Content-Type': 'application/json' };
  const config = {
    method: 'GET',
    headers,
  };

  const response = await window.fetch(
    `/api/${endpoint}?access_key=${process.env.REACT_APP_API_SECRET}${
      query && Object.entries(query).length ? `&${getQueryParams(query)}` : ''
    }`,
    config
  );

  if (response.ok) {
    return await response.json();
  } else {
    const errorMessage = await response.text();
    return Promise.reject(errorMessage);
  }
};
export default client;
