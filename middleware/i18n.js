const i18nMiddleware = (req, res, next) => {
  const languages = ['tr', 'en', 'vi', 'th', 'fil', 'kk', 'uz'];
  const lang = req.query.lang || req.headers['accept-language']?.split(',')[0].split('-')[0] || 'en';
  
  req.lang = languages.includes(lang) ? lang : 'en';
  res.setHeader('Content-Language', req.lang);
  next();
};

module.exports = i18nMiddleware;
