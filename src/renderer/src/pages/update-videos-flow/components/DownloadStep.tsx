import Button from "@renderer/components/Button";
import UpdateVideoFlowStepTemplate from "./UpdateVideoFlowStepTemplate";
import { FolderSelect } from "@renderer/components/FolderSelect";
import { useUpdateVideosFlow } from "@renderer/contexts/UpdateVideosFlowContext";
import { useState } from "react";
import { DownloadAndRenameDto } from "@shared/models/dtos/upload-flow-manager/download-and-rename.dto";

export default function DownloadStep(): React.JSX.Element {
  const { flowData, updateFlowData, rows, setRows } = useUpdateVideosFlow();
  const [downloadStarted, setDownloadStarted] = useState<boolean>(false);

  async function downloadVideos(): Promise<void> {
    const { downloadFolderPath, sheetPath, firstNameColumn, lastNameColumn, sectorColumn, urlColumn } = flowData;

    if (!downloadFolderPath || !sheetPath || !firstNameColumn || !lastNameColumn || !sectorColumn || !urlColumn) {
      window.alert('Campos faltando');
      return;
    }

    const dto: DownloadAndRenameDto = {
      destinationFolderPath: downloadFolderPath,
      sheet: {
        sheetPath,
        firstNameColumnIndex: firstNameColumn.index,
        lastNameColumnIndex: lastNameColumn.index,
        sectorColumnIndex: sectorColumn.index,
        urlColumnIndex: urlColumn.index
      }
    }

    const response = await window.api.uploadFlowsManager.downloadAndRename(dto);

    if (response.success) {
      const { results } = response.data;
      setRows(prev => [...prev].map((item, index) => {
        const result = results[index];
        return { ...item, error: result.error, fileName: result.fileName };
      }));
      updateFlowData({ downloadsCompleted: true });
    } else {
      const { code, message, details } = response.error;
      window.alert(`Erro: ${code} | ${message} | ${details}`);
    }
  }

  async function handleDownload() {
    window.api.uploadFlowsManager.onTotalRows((payload) => {
      const { totalRows } = payload;
      setRows(Array.from(new Array(totalRows), () => ({ rowIndex: -1 })));
    });

    window.api.uploadFlowsManager.onDownloadProgress((payload) => {
      const { fileName, progress, rowIndex } = payload;
      setRows(prev => {
        const newList = [...prev];
        newList[rowIndex - 1] = { fileName, progress, error: newList[rowIndex - 1].error, rowIndex };
        return newList;
      });
    })

    setDownloadStarted(true);
    await downloadVideos();
  }

  return (
    <UpdateVideoFlowStepTemplate>
      {!downloadStarted && !flowData.downloadsCompleted && (
        <>
          <p className="text-white">Selecione a pasta e o download será feito</p>

          <FolderSelect folderPath={flowData.downloadFolderPath ?? null} onPathChange={(newPath) => updateFlowData({ downloadFolderPath: newPath })} />

          <Button disabled={!flowData.downloadFolderPath} onClick={handleDownload} >
            Iniciar Download
          </Button>
        </>
      )}

      {(downloadStarted || flowData.downloadsCompleted) && (
        <>
          <p> Download {flowData.downloadsCompleted ? 'concluído' : 'iniciado'} </p>
          <div className="h-min w-full overflow-y-auto shadow-lg shadow-[rgba(0,0,0,0.4)]">
            <table className="bg-[#1b1b1f] w-full text-center">
              <thead className="">
                <tr>
                  <th className="py-2 px-4 border-b"> Linha </th>
                  <th className="py-2 px-4 border-x"> Arquivo </th>
                  <th className="py-2 px-4 border-x"> Progresso </th>
                  <th className="py-2 px-4 border-b"> Resultado </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index} className={`${row.error ? '' : ''}`}>
                    <td className="py-2 px-4 border-t border-[white]">{index + 2}</td>
                    <td className="py-2 px-4 border-t border-x border-[white]">{row.fileName ?? 'N/A'}</td>
                    <td className="py-2 px-4 border-t border-x border-[white]">{row.progress ?? 'N/A'}</td>
                    <td className={`py-2 px-4 border-t border-[white] ${row.error === undefined ? 'opacity-50' : row.error == null ? 'text-[rgb(50,255,50)]' : 'text-[red]'}`}>
                      {row.error === undefined
                        ? 'N/A'
                        : row.error === null
                          ? 'Sucesso'
                          : row.error}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </UpdateVideoFlowStepTemplate>
  );
}