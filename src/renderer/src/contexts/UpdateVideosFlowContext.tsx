import { DownloadAndRenameDto } from "@shared/models/dtos/upload-flow-manager/download-and-rename.dto";
import { createContext, useContext, useReducer } from "react"
import { Outlet } from "react-router-dom";

export type ColumnData = {
  header: string,
  index: number
}

type FlowData = {
  extractedHeaders?: Array<ColumnData>,
  sheet?: File,
  sheetPath?: string,
  firstNameColumn?: ColumnData,
  lastNameColumn?: ColumnData,
  sectorColumn?: ColumnData,
  descriptionColumns?: Array<ColumnData>
  urlColumn?: ColumnData,
  downloadFolderPath?: string,
  downloadsCompleted?: boolean
}

type UpdateVideosFlowContextType = {
  flowData: FlowData,
  updateFlowData: React.ActionDispatch<[next: FlowData]>,
  downloadVideos: () => void
}

const UpdateVideosFlowContext = createContext<UpdateVideosFlowContextType | null>(null);

export function UpdateVideosFlowProvider(): React.JSX.Element {
  const [flowData, updateFlowData] = useReducer((prev: FlowData, next: FlowData) => ({ ...prev, ...next }), {});

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

  return (
    <UpdateVideosFlowContext.Provider value={{
      flowData, updateFlowData, downloadVideos
    }}>
      <Outlet />
    </UpdateVideosFlowContext.Provider>
  );
}

export function useUpdateVideosFlow(): UpdateVideosFlowContextType {
  const context = useContext(UpdateVideosFlowContext);
  if (!context) throw new Error(`"${useUpdateVideosFlow.name}" deve ser usado dentro de um "${UpdateVideosFlowProvider.name}"`);
  return context;
}