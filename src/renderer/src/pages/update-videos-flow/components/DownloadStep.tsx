import Button from "@renderer/components/Button";
import UpdateVideoFlowStepTemplate from "./UpdateVideoFlowStepTemplate";
import { FolderSelect } from "@renderer/components/FolderSelect";
import { useUpdateVideosFlow } from "@renderer/contexts/UpdateVideosFlowContext";
import { useState } from "react";
import { DownloadAndRenameDto } from "@shared/models/dtos/upload-flow-manager/download-and-rename.dto";

export default function DownloadStep(): React.JSX.Element {
  const { flowData, updateFlowData } = useUpdateVideosFlow();
  const [startedDownload, setStartedDownload] = useState<boolean>(false);
  const [completedDownload, setCompletedDownload] = useState<boolean>(false);
  const [rows, setRows] = useState<Array<{ fileName?: string, progress?: string, error?: string | null }>>([]);

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
      setRows(prev => [...prev].map((item, index) => ({ ...item, error: results[index].error })));
      setCompletedDownload(true);
    } else {
      const { code, message, details } = response.error;
      window.alert(`Erro: ${code} | ${message} | ${details}`);
    }
  }

  async function handleDownload() {
    window.api.uploadFlowsManager.onTotalRows((payload) => {
      const { totalRows } = payload;
      setRows(Array.from(new Array(totalRows), () => ({})));
    });

    window.api.uploadFlowsManager.onDownloadProgress((payload) => {
      const { fileName, progress, rowIndex } = payload;
      setRows(prev => {
        const newList = [...prev];
        newList[rowIndex - 1] = { fileName, progress };
        return newList;
      });
    })

    setStartedDownload(true);
    await downloadVideos();
  }

  return (
    <UpdateVideoFlowStepTemplate>
      {!startedDownload && (
        <>
          <p className="text-white">Selecione a pasta e o download será feito</p>

          <FolderSelect folderPath={flowData.downloadFolderPath ?? null} onPathChange={(newPath) => updateFlowData({ downloadFolderPath: newPath })} />

          <Button disabled={!flowData.downloadFolderPath} onClick={handleDownload} >
            Iniciar Download
          </Button>
        </>
      )}

      {startedDownload && (
        <>
          <p> Download {completedDownload ? 'concluído' : 'iniciado'} </p>
        </>
      )}

      {startedDownload && (
        <table className="bg-[#1b1b1f]">
          <thead>
            <th className="py-2 px-4 border-b"> Linha </th>
            <th className="py-2 px-4 border-x"> Arquivo </th>
            <th className="py-2 px-4 border-x"> Progresso </th>
            <th className="py-2 px-4 border-b"> Resultado </th>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr>
                <td className="py-2 px-4 border-t">{index + 1}</td>
                <td className="py-2 px-4 border-t border-x">{row.fileName ?? 'N/A'}</td>
                <td className="py-2 px-4 border-t border-x">{row.progress ?? 'N/A'}</td>
                <td className="py-2 px-4 border-t">{row.error ?? row.error === null ? 'Sucesso' : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </UpdateVideoFlowStepTemplate>
  );
}