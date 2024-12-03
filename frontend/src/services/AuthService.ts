import axios from "axios"

// @ts-ignore
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
// @ts-ignore
const GOOGLE_CLIENT_SECRET = import.meta.env.VITE_GOOGLE_SECRET_KEY

export const initiateGoogleLogin = () => {
    const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
    const redirectUri = `${window.location.origin}/auth/google/callback`

    const params = {
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'openid email profile',
        access_type: 'offline',
        prompt: 'consent',
    }

    const queryString = Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&')

    window.location.href = `${googleAuthUrl}?${queryString}`
}

export const getGoogleUserInfo = async (code: string) => {
    try {
        // Primero, intercambiamos el código por un token de acceso
        const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
            code,
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            redirect_uri: `${window.location.origin}/auth/google/callback`,
            grant_type: 'authorization_code',
        })

        const { access_token } = tokenResponse.data

        // Luego, usamos el token para obtener la información del usuario
        const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        })

        return userInfoResponse.data
    } catch (error) {
        console.error('Error al obtener información del usuario:', error)
        throw error
    }
}
