import { youtube_v3 } from "googleapis";
import { createContext, useContext, useReducer, useState } from "react"
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
  downloadsCompleted?: boolean,
  playlist?: youtube_v3.Schema$Playlist
}

type UpdateVideosFlowContextType = {
  flowData: FlowData,
  updateFlowData: React.ActionDispatch<[next: FlowData]>,
  rows: Array<{ fileName?: string, progress?: string, error?: string | null, rowIndex: number }>,
  setRows: React.Dispatch<React.SetStateAction<{
    fileName?: string;
    progress?: string;
    error?: string | null;
    rowIndex: number;
  }[]>>
}

const UpdateVideosFlowContext = createContext<UpdateVideosFlowContextType | null>(null);

export function UpdateVideosFlowProvider(): React.JSX.Element {
  const [flowData, updateFlowData] = useReducer((prev: FlowData, next: FlowData) => ({ ...prev, ...next }), {});
  const [rows, setRows] = useState<Array<{ fileName?: string, progress?: string, error?: string | null, rowIndex: number }>>([]);

  return (
    <UpdateVideosFlowContext.Provider value={{
      flowData, updateFlowData, rows, setRows
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