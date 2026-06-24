import Button from "@renderer/components/Button";
import UpdateVideoFlowStepTemplate from "./UpdateVideoFlowStepTemplate";
import { FolderSelect } from "@renderer/components/FolderSelect";
import { useUpdateVideosFlow } from "@renderer/contexts/UpdateVideosFlowContext";
import { useState } from "react";
import { DownloadAndRenameDto } from "@shared/models/dtos/upload-flow-manager/download-and-rename.dto";
import Table from "@renderer/components/Table";
import toast from 'react-hot-toast';

export default function DownloadStep(): React.JSX.Element {
  const { flowData, updateFlowData, rows, setRows } = useUpdateVideosFlow();
  const [downloadStarted, setDownloadStarted] = useState<boolean>(false);

  async function downloadVideos(): Promise<void> {
    const { downloadFolderPath, sheetPath, firstNameColumn, lastNameColumn, sectorColumn, urlColumn } = flowData;

    if (!downloadFolderPath || !sheetPath || !firstNameColumn || !sectorColumn || !urlColumn) {
      toast('Campos faltando');
      return;
    }

    const dto: DownloadAndRenameDto = {
      destinationFolderPath: downloadFolderPath,
      sheet: {
        sheetPath,
        firstNameColumnIndex: firstNameColumn.index,
        lastNameColumnIndex: lastNameColumn ? lastNameColumn.index : undefined,
        sectorColumnIndex: sectorColumn.index,
        urlColumnIndex: urlColumn.index
      }
    }

    const response = await window.api.uploadFlowsManager.downloadAndRename(dto);

    if (response.success) {
      const { results } = response.data;
      setRows(prev => [...prev].map((item, index) => {
        const result = results[index];
        return { ...item, error: result.error, fileName: item.fileName ?? result.fileName };
      }));
      updateFlowData({ downloadsCompleted: true });
    } else {
      const { code, message, details } = response.error;
      toast(`Erro: ${code} | ${message} | ${details}`);
    }
  }

  async function handleDownload() {
    window.api.uploadFlowsManager.onTotalRows((payload) => {
      const { totalRows } = payload;
      const list: Array<{ rowIndex: number; }> = [];
      for (let i = 0; i < totalRows; i++) { list.push({ rowIndex: i + 1 }) };
      setRows(list);
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

          <Table
            headers={['Linha', 'Arquivo', 'Progresso', 'Resultado']}
            rows={rows.map(row => [
              { value: String(row.rowIndex) },
              { value: row.fileName ?? 'N/A' },
              { value: row.progress ?? 'N/A' },
              {
                className: `${row.error === undefined ? 'opacity-50' : row.error == null ? 'text-[rgb(50,255,50)]' : 'text-[red]'}`,
                value: row.error === undefined
                  ? 'N/A'
                  : row.error === null
                    ? 'Sucesso'
                    : row.error
              }
            ])}
          />
        </>
      )}
    </UpdateVideoFlowStepTemplate>
  );
}