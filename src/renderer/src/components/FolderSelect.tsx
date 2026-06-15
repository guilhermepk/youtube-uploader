import { useState, useEffect } from 'react';

interface FolderSelectProps {
  folderPath: string | null;
  onPathChange: (newPath: string) => void;
}

export function FolderSelect({
  onPathChange,
  folderPath: fatherComponentPath
}: FolderSelectProps) {
  const [path, setPath] = useState<string | null>(fatherComponentPath);

  async function handleSelectFolder() {
    const response = await window.api.fileManager.dialogSelecFolder();

    if (response.success) {
      const { folderPath } = response.data;

      if (folderPath) {
        setPath(folderPath);
        onPathChange(folderPath);
      }
    } else {
      const { code, message, details } = response.error;
      window.alert(`Erro: ${code} || ${message} || ${details}`);
    }
  }

  useEffect(() => {
    setPath(fatherComponentPath);
  }, [fatherComponentPath]);

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleSelectFolder}
        className="
          bg-blue-400 text-black
          text-sm font-medium
          py-2.5 px-6
          rounded-full
          cursor-pointer
          hover:opacity-50
          transition-opacity
        "
      >
        Selecionar Pasta de Destino
      </button>

      <div className='flex flex-col items-center justify-center my-3'>
        {path
          ? (
            <>
              <p>
                Destino selecionado:
              </p>
              <span className="text-neutral-400 break-all text-center px-4">
                {path}
              </span>
            </>
          )
          : <p>Nenhuma pasta selecionada</p>
        }
      </div>
    </div>
  );
}