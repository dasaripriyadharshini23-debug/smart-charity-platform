import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  fetchAuthSession,
  getCurrentUser,
  signIn as amplifySignIn,
  signOut as amplifySignOut,
} from "aws-amplify/auth";

const AuthContext = createContext(null);

async function getAuthenticatedUser() {
  const currentUser = await getCurrentUser();
  const session = await fetchAuthSession();

  const groups =
    session.tokens?.accessToken?.payload["cognito:groups"] ?? [];

  const role = groups.includes("admin")
    ? "admin"
    : groups.includes("collector")
    ? "collector"
    : groups.includes("donor")
    ? "donor"
    : null;

  const email =
    currentUser.signInDetails?.loginId ?? currentUser.username;

  return {
    name: email.split("@")[0],
    email,
    role,
    userId: currentUser.userId,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function restoreSession() {
      try {
        const currentUser = await getAuthenticatedUser();

        if (active) setUser(currentUser);
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setAuthLoading(false);
      }
    }

    restoreSession();

    return () => {
      active = false;
    };
  }, []);

  const login = async (email, password) => {
    const result = await amplifySignIn({
      username: email,
      password,
    });

    if (!result.isSignedIn) {
      throw new Error(
        `Additional sign-in step required: ${result.nextStep.signInStep}`
      );
    }

    const authenticatedUser = await getAuthenticatedUser();
    setUser(authenticatedUser);

    return authenticatedUser;
  };

  const logout = async () => {
    await amplifySignOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, authLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
