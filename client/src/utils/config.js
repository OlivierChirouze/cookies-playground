// TODO read config from caddyfile
export const backHostName = 'back.third-party.playground';

// TODO more elaborate extraction of TLD+1 (based on npm library)
export const backTLDPlusOne = backHostName.split('.').slice(1).join('.');
