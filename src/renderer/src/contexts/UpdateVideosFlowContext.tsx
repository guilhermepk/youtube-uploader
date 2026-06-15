import { createContext, useContext, useReducer } from "react"
import { Outlet } from "react-router-dom";

export type ColumnData = {
  header: string,
  index: number
}

type FlowData = {
  extractedHeaders?: Array<ColumnData>,
  file?: File,
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
  updateFlowData: React.ActionDispatch<[next: FlowData]>
}

const UpdateVideosFlowContext = createContext<UpdateVideosFlowContextType | null>(null);

export function UpdateVideosFlowProvider(): React.JSX.Element {
  const [flowData, updateFlowData] = useReducer((prev: FlowData, next: FlowData) => ({ ...prev, ...next }), {});

  return (
    <UpdateVideosFlowContext.Provider value={{
      flowData, updateFlowData
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