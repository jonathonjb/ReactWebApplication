export const login = (username) => {
    return {
        type: 'LOGIN',
        username: username
    }
}

export const logout = () => {
    return {
        type: 'LOGOUT',
        username: null
    }
}