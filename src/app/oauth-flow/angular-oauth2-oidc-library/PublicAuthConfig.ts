import { AuthConfig } from 'angular-oauth2-oidc';

const BASE_URL = "https://innovaspeak.memberful.com";
const REDIRECT_URI = 'https://borczeangelov.github.io/poc-spa-oauth2-memberful-api/oauth-callback';
const CLIENT_ID = 'sH7akpCXd5bPaXggr9UVQgxQ';

export const publicAuthConfig: AuthConfig = {
    issuer: BASE_URL,
    redirectUri: REDIRECT_URI,
    clientId: CLIENT_ID,
    responseType: 'code', // Using Authorization Code flow with PKCE
    useSilentRefresh: true, // Recommended for SPAs
    silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html', // Adjust if necessary //TODO
    showDebugInformation: true, // Helpful for debugging, disable in production
    scope: '', // Memberful does not use scopes in the same way, so this is empty or a placeholder
    oidc: false, // Important: Disable OIDC since Memberful does not use OpenID Connect    
};