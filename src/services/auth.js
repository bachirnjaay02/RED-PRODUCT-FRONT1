const API_BASE_URL = (process.env.REACT_APP_API_URL || 'https://red-product-db-production.up.railway.app/api').replace(/\/$/, '');
const STORAGE_KEY = 'red_product_user';

const getErrorMessage = (data) => {
  if (data?.errors) {
    const firstError = Object.values(data.errors).flat()[0];
    if (firstError) return firstError;
  }
  return data?.message || 'Une erreur est survenue.';
};

// ✅ Récupère le token stocké
const getToken = () => {
  const user = getStoredUser();
  return user?.token || null;
};

const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}), // ✅ Token ajouté
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    // ✅ Gestion spécifique email non vérifié (403)
    if (response.status === 403 && data?.message?.toLowerCase().includes('verify')) {
      throw new Error('Votre compte n\'est pas encore activé. Veuillez vérifier vos e-mails.');
    }
    throw new Error(getErrorMessage(data));
  }

  return data;
};

export const loginUser = async (payload) =>
  apiRequest('/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const registerUser = async (payload) =>
  apiRequest('/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const logoutUser = async () => {
  const token = getToken();
  return apiRequest('/logout', {
    method: 'POST',
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
  }).catch(() => ({ message: 'Déconnexion locale.' }));
};
export const requestPasswordReset = async (payload) =>
  apiRequest('/forgotpassword', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

// ✅ Renvoyer l'email de vérification
export const resendVerificationEmail = async () =>
  apiRequest('/email/verification-notification', {
    method: 'POST',
  });

export const saveUser = (user) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};

export const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
  } catch {
    return null;
  }
};

export const clearUser = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export { API_BASE_URL, STORAGE_KEY };