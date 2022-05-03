import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from "react";
import JWTManager from "../utils/jwt";

interface IAuthContext {
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  checkAuth: () => Promise<void>;
  logoutClient: () => void;
  getUserId: () => number | null;
}

const defaultIsAuthenticated = false;

export const AuthContext = createContext<IAuthContext>({
  isAuthenticated: defaultIsAuthenticated,
  setIsAuthenticated: () => {},
  checkAuth: () => Promise.resolve(),
  logoutClient: () => {},
  getUserId: () => null,
});

export const useAuthContext = () => useContext(AuthContext);

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    defaultIsAuthenticated
  );

  const checkAuth = useCallback(async () => {
    if (JWTManager.getToken()) setIsAuthenticated(true);
    else {
      await JWTManager.getRefreshToken();
      if (JWTManager.getToken()) setIsAuthenticated(true);
    }
  }, []);

  const logoutClient = () => {
    JWTManager.deleteToken();
    setIsAuthenticated(false);
  };

  const authContextData = {
    isAuthenticated,
    setIsAuthenticated,
    checkAuth,
    logoutClient,
    getUserId: JWTManager.getUserId,
  };

  return (
    <AuthContext.Provider value={authContextData}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
