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

export const handleGoogleCallback = async (code: string) => {
    try {
        const response = await fetch(`${BASE_API_HOST}/auth/google/callback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
        })

        if (!response.ok) {
            throw new Error('Error en la autenticación')
        }

        const data = await response.json()
        return data.token
    } catch (error) {
        console.error('Error en el callback:', error)
        throw error
    }
}
