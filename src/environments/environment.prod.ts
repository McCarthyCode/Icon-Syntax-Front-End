const production = {
  production: true,
  urlRoot: 'https://iconsyntax.com',
};

export const environment = {
  ...production,
  apiBase: production.urlRoot + '/api/v0-alpha',
};
