import logo from './assets/icon.png';
import googleIcon from './assets/google.svg';
import { IpcResponse } from '@shared/models/interfaces/ipc-response.interface';
import { useEffect, useState } from 'react';
import { IsGoogleAuthenticatedResponse } from '@shared/responses/google/is-google-authenticated.response';

function App(): React.JSX.Element {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);
  const [email, setEmail] = useState<string | undefined>(undefined);

  async function getAuthData(): Promise<void> {
    const response: IpcResponse<IsGoogleAuthenticatedResponse> = await window.api.google.isAuthenticated();

    if (response.success) {
      setIsAuthenticated(response.data.isAuthenticated);
      setEmail(response.data.email ?? undefined);
    } else {
      const { code, message, details } = response.error;
      window.alert(`deu errado: ${code} | ${message} | ${details?.join('; ')}`)
    }
  }

  async function handleGoogleAuth(): Promise<void> {
    const response: IpcResponse<null> = await window.api.google.startAuth();

    if (response.success) {
      window.api.google.onAuthSuccess((payload) => {
        setIsAuthenticated(true);
        setEmail(payload.email ?? undefined);
      })
    } else {
      const { code, message, details } = response.error;
      window.alert(`deu errado: ${code} | ${message} | ${details?.join('; ')}`)
    }
  }

  useEffect(() => {
    getAuthData();
  }, []);

  return (
    <div
      className={`
        text-center
        flex flex-col justify-center items-center gap-4
      `}
    >
      <img src={logo} width={200} height={200} />

      <p className="text-5xl"> Bem-vindo de volta </p>

      <p className="w-100">
        Faça login com sua conta do Google para usar o YouTube Uploader.
      </p>

      <button
        onClick={handleGoogleAuth}
        className={`
          mt-10!
          rounded-xl
          bg-zinc-900
          p-4
          w-fit h-fit
          flex justify-center items-center gap-4
          hover:border hover:border-blue-600 hover:cursor-pointer
        `}
      >
        <img src={googleIcon} width={25} height={25} />
        Logar com o Google
      </button>

      <div>
        <p> Autenticado: {isAuthenticated ? 'Sim' : 'Não'} </p>
        <p> Email: {email ?? 'Indefinido'} </p>
      </div>
    </div>
  )
}

export default App
