import Button from "@renderer/components/Button";
import UpdateVideoFlowStepTemplate from "./UpdateVideoFlowStepTemplate";
import { FolderSelect } from "@renderer/components/FolderSelect";
import { useUpdateVideosFlow } from "@renderer/contexts/UpdateVideosFlowContext";
import { useState } from "react";
import { DownloadAndRenameDto } from "@shared/models/dtos/upload-flow-manager/download-and-rename.dto";

export default function DownloadStep(): React.JSX.Element {
  const { flowData, updateFlowData } = useUpdateVideosFlow();
  const [startedDownload, setStartedDownload] = useState<boolean>(false);

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

      const stringResults = results.map(item => `Linha ${item.rowIndex + 1}: ${item.success ? 'sucesso' : 'falha'}.${item.success ? '' : ` Motivo: ${item.error}`}`);
      window.alert(`Resultado:\n\n${stringResults.join('\n')}`);
    } else {
      const { code, message, details } = response.error;
      window.alert(`Erro: ${code} | ${message} | ${details}`);
    }
  }

  async function handleDownload() {
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
        <p> Download iniciado </p>
      )}
    </UpdateVideoFlowStepTemplate>
  );
}