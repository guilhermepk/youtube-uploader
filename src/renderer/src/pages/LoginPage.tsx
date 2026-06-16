import logo from '../assets/icon.png';
import googleIcon from '../assets/google.svg';
import { IpcResponse } from '@shared/models/interfaces/ipc-response.interface';
import { useAuth } from '@renderer/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { routes } from '@renderer/common/routes';
import packageJson from '../../../../package.json';

export default function LoginPage(): React.JSX.Element {
  const { refreshAuthData } = useAuth();
  const navigate = useNavigate();

  async function handleGoogleAuth(): Promise<void> {
    const response: IpcResponse<null> = await window.api.google.startAuth();

    if (response.success) {
      window.api.google.onAuthSuccess(async (_payload) => {
        await refreshAuthData()
        navigate(routes.homePage.path);
      })
    } else {
      const { code, message, details } = response.error;
      window.alert(`deu errado: ${code} | ${message} | ${details?.join('; ')}`)
    }
  }

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

      <p className='absolute opacity-75 bottom-0 mb-2'>
        v{packageJson.version}
      </p>
    </div>
  )
}