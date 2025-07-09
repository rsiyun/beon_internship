export const isTokenValid = (token) => {
    if (!token) return false;
    
    const expiresAt = localStorage.getItem('expires_at');
    if (!expiresAt) return false;
    return new Date(expiresAt) > new Date();
};

export const setAuth = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('expires_at', data.expires_at);
    localStorage.setItem('user', JSON.stringify(data.user));
};

export const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('user');
};

export const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};