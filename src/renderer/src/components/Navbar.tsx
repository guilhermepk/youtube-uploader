import { useAuth } from '@renderer/contexts/AuthContext';
import logo from '../assets/icon.png';
import { useEffect } from 'react';
import { LogOut } from 'lucide-react';

export default function Navbar(): React.JSX.Element {
  const { userName, pictureUrl, email } = useAuth();

  useEffect(() => {
    console.log(pictureUrl);
  }, [pictureUrl]);

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
      <img src={logo} width={60} height={60} />

      {/* <div className='flex items-center justify-center gap-2 cursor-pointer border border-transparent hover:border-white p-2 rounded-[10px]'> */}
      <div className='flex items-center justify-center gap-2p-2'>
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