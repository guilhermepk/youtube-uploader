import { useState, ChangeEvent, useEffect } from 'react';

interface FileUploadProps {
  file: File | null;
  onFileChange: (newFile: File) => void;
}

export function FileUpload({
  onFileChange,
  file: fatherComponentFile,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(fatherComponentFile);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      const isValid =
        selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || // .xlsx
        selectedFile.type === 'application/vnd.ms-excel' || // .xls
        selectedFile.type === 'text/csv' || // .csv
        selectedFile.name.match(/\.(xlsx|xls|csv)$/i); // fallback de extensão

      if (isValid) {
        setFile(selectedFile);
      } else {
        alert('Por favor, selecione apenas arquivos de planilha (.xlsx, .xls, .csv).');
        event.target.value = '';
      }
    }
  }

  useEffect(() => {
    if (file) onFileChange(file);
  }, [file]);

  useEffect(() => {
    setFile(fatherComponentFile);
  }, [fatherComponentFile]);

  return (
    <div className="flex flex-col items-center">
      <input
        type="file"
        // O atributo accept restringe as opções no explorador de arquivos
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
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

      <div className="flex flex-col items-center justify-center my-3">
        {file ? (
          <>
            <p>Arquivo selecionado:</p>
            <span className="text-neutral-400">{file.name}</span>
          </>
        ) : (
          <p>Nenhum arquivo selecionado</p>
        )}
      </div>
    </div>
  );
}