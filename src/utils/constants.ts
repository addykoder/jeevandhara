// export const serverURL = 'http://127.0.0.1';
// export const serverURL = 'http://192.168.43.4'
// export const serverURL = 'https://substitutor-api.onrender.com'
// export const serverURL = 'https://substitutor-api.vercel.app'


export const serverURL = import.meta.env.VITE_SERVER_URL || 'http://127.0.0.1:80' || 'https://jeevandhara1.vercel.com';