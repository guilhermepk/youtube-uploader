import { useState, ChangeEvent } from 'react';

interface FileUploadProps {
  onSubmit?: (file: File) => void,
  submitButtonText?: string
}

export function FileUpload({
  onSubmit, submitButtonText
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  async function handleUpload(event: React.SubmitEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (!file) {
      alert('Selecione um arquivo primeiro!');
      return;
    }

    onSubmit?.(file);
  };

  return (
    <form onSubmit={handleUpload} className="p-4 flex flex-col items-center- justify-center gap-4">
      <div className="flex flex-col items-center">
        <input
          type="file"
          onChange={handleFileChange}
          // text-[0px] faz o texto nativo sumir e não ocupar espaço
          // file:mr-0 tira qualquer margem residual do botão
          className="
            text-[0px] file:mr-0
            w-min
            file:text-sm file:font-medium
            bg-blue-400
            file:py-2.5 file:px-6
            rounded-full
            file:cursor-pointer
            hover:opacity-50
            "
        />

        <div className='flex flex-col items-center justify-center my-3'>
          {file
            ? (
              <>
                <p>
                  Arquivo selecionado:
                </p>
                <span className="text-neutral-400">
                  {file.name}
                </span>
              </>
            )
            : <p>Nenhum arquivo selecionado</p>
          }
        </div>
      </div>
      <button
        type="submit"
        disabled={file ? false : true}
        className={`
          px-4 py-1
          text-white
          rounded
          bg-blue-600
          ${file
            ? 'hover:opacity-50 cursor-pointer'
            : 'opacity-10 cursor-not-allowed'
          }
        `}
      >
        {submitButtonText ?? 'Enviar'}
      </button>
    </form>
  );
}