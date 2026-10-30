import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => authService.getCurrentSession());
  const [allUsers, setAllUsers] = useState(() => authService.getAllUsers());

  const token = session?.token || null;
  const user = token ? session?.user || null : null;
  const hasToken = Boolean(token && user);

  const refreshUsers = useCallback(() => {
    setAllUsers(authService.getAllUsers());
  }, []);

  const login = useCallback(async (credentials) => {
    const result = await authService.login(credentials);
    setSession({
      user: result.user,
      token: result.token,
      rememberMe: Boolean(credentials.rememberMe),
    });
    setAllUsers(authService.getAllUsers());
    return result;
  }, []);

  const register = useCallback(async (payload) => {
    const res = await authService.register(payload);
    setAllUsers(authService.getAllUsers());
    return res;
  }, []);

  const verifyEmail = useCallback(async (payload) => {
    const result = await authService.verifyEmail(payload);
    setSession({ user: result.user, token: result.token, rememberMe: true });
    setAllUsers(authService.getAllUsers());
    return result;
  }, []);

  const updateProfile = useCallback(
    async (updates) => {
      if (!user || !token) throw new Error('NOT_AUTHENTICATED');
      const updatedUser = await authService.updateProfile(user.id, updates);
      setSession((prev) => (prev ? { ...prev, user: updatedUser } : null));
      setAllUsers(authService.getAllUsers());
      return updatedUser;
    },
    [user, token]
  );

  const adminUpdateUser = useCallback((targetUserId, patch) => {
    const updatedList = authService.adminUpdateUser(targetUserId, patch);
    setAllUsers(updatedList);
    setSession((prev) => {
      if (!prev || prev.user?.id !== targetUserId) return prev;
      const me = updatedList.find((u) => u.id === targetUserId);
      return me ? { ...prev, user: me } : prev;
    });
    return updatedList;
  }, []);

  const changePassword = useCallback(
    async (payload) => {
      if (!user || !token) throw new Error('NOT_AUTHENTICATED');
      return authService.changePassword(user.id, payload);
    },
    [user, token]
  );

  const logout = useCallback(() => {
    authService.logout();
    setSession(null);
  }, []);

  const role = hasToken ? user?.accountType : null;

  const value = useMemo(
    () => ({
      user,
      token,
      hasToken,
      role,
      allUsers,
      refreshUsers,
      adminUpdateUser,
      isAuthenticated: hasToken,
      isProfessional: hasToken && role === 'professional',
      isCustomer: hasToken && role === 'customer',
      isOperator: hasToken && (role === 'operator' || role === 'admin'),
      isAdmin: hasToken && role === 'admin',
      login,
      register,
      verifyEmail,
      updateProfile,
      changePassword,
      logout,
    }),
    [
      user,
      token,
      hasToken,
      role,
      allUsers,
      refreshUsers,
      adminUpdateUser,
      login,
      register,
      verifyEmail,
      updateProfile,
      changePassword,
      logout,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
