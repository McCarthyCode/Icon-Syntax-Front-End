import { production as secret } from './environment.secret';
import { shared } from './environment.shared';

const production = {
  production: true,
  urlRoot: 'https://iconsyntax.org',
};

export const environment = {
  apiBase: production.urlRoot + '/api/v0-alpha/',
  ...production,
  ...shared,
  ...secret,
};
