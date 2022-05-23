exports.parse = (url) => {
  const [protocol, path, search] = url.split(/\/\/|\?/g);

  const [query, fragment] = (search || '').split('#');

  const params = {};
  (query || '').split('&').forEach(p => {
    const [k, v] = p.split('=');
    if (k && v != null) {
      params[k] = v;
    }

  });

  return { protocol, path, params, fragment };
};

exports.stringify = (parsedUrl) => {
  let url = `${parsedUrl.protocol}//${parsedUrl.path}`;

  if (parsedUrl.params) {
    url += '?' + Object.keys(parsedUrl.params).map(k => `${k}=${parsedUrl.params[k]}`).join('&');
  }

  if (parsedUrl.fragment) {
    url += '#' + parsedUrl.fragment;
  }

  return url;
};
