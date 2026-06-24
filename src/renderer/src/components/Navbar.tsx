import { useAuth } from '@renderer/contexts/AuthContext';
import logo from '../assets/icon.png';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { routes } from '@renderer/common/routes';
import packageJson from '../../../../package.json';
import toast from 'react-hot-toast';

export default function Navbar(): React.JSX.Element {
  const navigate = useNavigate();
  const { userName, pictureUrl, email } = useAuth();

  async function handleLogout(): Promise<void> {
    const response = await window.api.google.logout();

    if (response.success) {
      toast('Sessão do Google encerrada com sucesso');
      navigate(routes.loginPage.path);
    } else {
      const { code, message, details } = response.error;
      toast(`Erro: ${code} | ${message} | ${details}`);
    }
  }

  return (
    <div
      className={`
        shadow-md
        h-[60px] w-screen
        flex items-center justify-between
        bg-[#1b1b1f]
        p-2
      `}
    >
      <div className='flex items-center justify-center gap-2'>
        <img src={logo} width={60} height={60} className='cursor-pointer' onClick={() => navigate(routes.homePage.path)} />

        <p className='opacity-75'>
          v{packageJson.version}
        </p>
      </div>

      {/* <div className='flex items-center justify-center gap-2 cursor-pointer border border-transparent hover:border-white p-2 rounded-[10px]'> */}
      <div className='flex items-center justify-center p-2'>
        <div className='flex flex-col items-center justify-center'>
          <p className='text-[15px]'> {userName} </p>
          <p className='text-[12px] opacity-50'> {email} </p>
        </div>

        {pictureUrl && (
          <img
            src={pictureUrl}
            width={40}
            height={40}
            className='rounded-full'
          />
        )}

        <LogOut
          onClick={handleLogout}
          size={40}
          className={`
            cursor-pointer
            ml-5
            text-white hover:text-[red]
            border border-transparent
            hover:shadow-sm shadow-black
            rounded-[10px]
            p-2
          `}
        />
      </div>
    </div >
  );
}