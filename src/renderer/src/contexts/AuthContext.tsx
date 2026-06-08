import { routes } from "@renderer/common/routes";
import { IpcResponse } from "@shared/models/interfaces/ipc-response.interface";
import { IsGoogleAuthenticatedResponse } from "@shared/responses/google/is-google-authenticated.response";
import { createContext, JSX, useContext, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

type AuthContextType = {
  email: string | undefined;
  setEmail: React.Dispatch<React.SetStateAction<string | undefined>>
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | undefined>(undefined);

  async function getAuthData(): Promise<void> {
    const response: IpcResponse<IsGoogleAuthenticatedResponse> = await window.api.google.isAuthenticated();

    if (response.success) {
      const { data } = response;
      const { pathname } = location;
      const { loginPage, homePage } = routes;

      setEmail(data.email ?? undefined);

      if (!data.email && pathname !== loginPage.path) navigate(loginPage.path);
      else if (data.email && pathname == loginPage.path) navigate(homePage.path);
    } else {
      const { code, message, details } = response.error;
      window.alert(`deu errado: ${code} | ${message} | ${details?.join('; ')}`)
    }
  }

  useEffect(() => {
    getAuthData();
  }, []);

  return (
    <AuthContext.Provider value={{
      email, setEmail
    }}>
      <Outlet />
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('"useAuth" deve ser usado dentro de um "AuthProvider"');
  return context;
}