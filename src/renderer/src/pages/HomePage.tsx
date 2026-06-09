import { Upload } from "lucide-react";

export default function HomePage(): React.JSX.Element {
  return (
    <div
      className="flex flex-col items-center justify-center p-10 gap-10 w-full"
    >
      <h1> Bem-vindo ao Workspace </h1>

      <div
        className={`
          p-4
          bg-[#1b1b1f]
          shadow-sm shadow-black
          rounded-[10px]
          h-fit w-[300px]
          text-center
          flex flex-col items-center justify-center gap-5
        `}
      >
        <Upload />

        <h2> Fluxo completo </h2>

        <p className="text-justify">
          Faça o upload de uma planilha, mapeie as colunas e anexe os arquivos de vídeo para envio direto ao YouTube.
        </p>
      </div>
    </div>
  );
}