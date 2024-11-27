// @ts-ignore
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
// @ts-ignore
const BASE_API_HOST = import.meta.env.VITE_API_HOST

export const initiateGoogleLogin = () => {
    const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
    const redirectUri = `${window.location.origin}/auth/google/callback`

    const params = {
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: redirectUri,
        response_type: 'token',
        scope: 'openid email profile',
        access_type: 'offline',
        prompt: 'consent',
    }

    const queryString = Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&')

    window.location.href = `${googleAuthUrl}?${queryString}`
}
