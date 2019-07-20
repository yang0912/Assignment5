export const request = {
    GET: {
      method: 'GET',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
    },
    POST: {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
    },
    PUT: {
      method: 'PUT',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
    },
    DELETE: {
      method: 'DELETE',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
    }
  }

export const handleResponse = (response) => {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) return (data && data.msg) || response.statusText;
        return data;
    }).catch((e) => {
        return { ...e, code: 400 };
    });
}