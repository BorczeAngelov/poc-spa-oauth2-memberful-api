// This file contains the `PublicOAuthConfig` class which holds OAuth configuration constants.
// These constants, including CLIENT_ID and REDIRECT_URI, are intentionally public and designed to be safely exposed in client-side applications.
// Their exposure is a standard practice in OAuth 2.0 flows, facilitating the authentication process without compromising security.
export class PublicOAuthConfig {
    public static BASE_URL = "https://innovaspeak.memberful.com";
    public static REDIRECT_URI = 'https://borczeangelov.github.io/poc-spa-oauth2-memberful-api/oauth-callback';
    public static CLIENT_ID = 'FGhnH99zgmbzospxBqkTPknW';
    public static CODE_CHALLENGE_METHOD = "S256";
}