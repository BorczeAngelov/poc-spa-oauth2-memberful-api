import { AuthConfig } from 'angular-oauth2-oidc';

export const BASE_URL = "https://innovaspeak.memberful.com";
const REDIRECT_URI = 'https://borczeangelov.github.io/poc-spa-oauth2-memberful-api/oauth-callback';
const CLIENT_ID = 'sH7akpCXd5bPaXggr9UVQgxQ';

// does not use OpenID, which is not needed for Memberful.com
export const publicAuthConfig: AuthConfig = {
    redirectUri: REDIRECT_URI,
    clientId: CLIENT_ID,
    responseType: 'code', // Using Authorization Code flow with PKCE
    loginUrl: `${BASE_URL}/oauth`, // Adjust if necessary, the endpoint for initiating the authorization flow
    tokenEndpoint: `${BASE_URL}/oauth/token`, // Adjust if necessary, the endpoint for exchanging the authorization code for tokens

    useSilentRefresh: true, // Recommended for SPAs
    silentRefreshRedirectUri: window.location.origin + '/silent-refresh.html', // Adjust if necessary

    // issuer is not used since we're setting endpoints directly
    scope: '', // Memberful does not use scopes in the same way, so this is empty or a placeholder
    oidc: false, // Important: Disable OIDC since Memberful does not use OpenID Connect    

    showDebugInformation: false, // Helpful for debugging, disable in production
};