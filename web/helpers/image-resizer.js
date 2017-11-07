import URL from 'helpers/url';

module.exports = function(imageUrl, width, height) {
  return imageUrl;
  
  if (!imageUrl) {
    return imageUrl;
  }

  const url = URL.parse(imageUrl);

  url.protocol = 'http:';
  url.path = 'rsz.io/' + url.path;
  url.params.mode = 'max';
  url.params.bgcolor = 'white';
  url.params.quality = '85';
  url.params.sharpen = '';

  if (width) {
    url.params.width = width;
  }
  else {
    delete url.params.width;
  }

  if (height) {
    url.params.height = height;
  }
  else {
    delete url.params.height;
  }

  return URL.stringify(url);
};
