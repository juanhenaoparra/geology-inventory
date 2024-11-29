export const StorageService = {
    setUser: (user: any) => {
        localStorage.setItem('user', JSON.stringify(user))
    },

    getUser: () => {
        const user = localStorage.getItem('user')
        return user ? JSON.parse(user) : null
    },

    clearUser: () => {
        localStorage.removeItem('user')
    },
}
