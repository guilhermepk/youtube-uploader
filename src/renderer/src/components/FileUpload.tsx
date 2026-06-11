import { useState, ChangeEvent, useEffect } from 'react';

interface FileUploadProps {
  file: File | null;
  onFileChange: React.Dispatch<React.SetStateAction<File | null>>
}

export function FileUpload({
  onFileChange, file: fatherComponentFile
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(fatherComponentFile);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  useEffect(() => {
    onFileChange(file);
  }, [file]);

  useEffect(() => {
    setFile(fatherComponentFile);
  }, [fatherComponentFile]);

  return (
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
  );
}