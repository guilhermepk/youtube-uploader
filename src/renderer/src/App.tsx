import logo from './assets/icon.png';
import googleIcon from './assets/google.svg';

function App(): React.JSX.Element {
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
        onClick={() => window.alert('Ainda não dá não, guenta aí até a atualização')}
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
    </div>
  )
}

export default App
