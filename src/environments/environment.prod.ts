import { prod as secret } from './secret';

const production = {
  production: true,
  urlRoot: 'https://iconsyntax.org',
};

export const environment = {
  ...secret,
  ...production,
  apiBase: production.urlRoot + '/api/v0-alpha/',
  mediaBase: production.urlRoot + '',
};
