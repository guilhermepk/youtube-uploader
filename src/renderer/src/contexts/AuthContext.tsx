import { routes } from "@renderer/common/routes";
import { IpcResponse } from "@shared/models/interfaces/ipc-response.interface";
import { GetGoogleUserDataResponse } from "@shared/responses/google/get-google-user-data.response";
import { createContext, JSX, useContext, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

type AuthContextType = {
  email: string | null;
  userName: string | null;
  pictureUrl: string | null;
  refreshAuthData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider(): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [pictureUrl, setPictureUrl] = useState<string | null>(null);

  async function getAuthData(): Promise<void> {
    const response: IpcResponse<GetGoogleUserDataResponse> = await window.api.google.getUserData();

    if (response.success) {
      const { data } = response;
      const { pathname } = location;
      const { loginPage, homePage } = routes;

      setEmail(data.email);
      setUserName(data.userName);
      setPictureUrl(data.pictureUrl);

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
      email,
      userName,
      pictureUrl,
      refreshAuthData: getAuthData
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