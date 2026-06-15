import { FileUpload } from "@renderer/components/FileUpload";
import { useUpdateVideosFlow } from "@renderer/contexts/UpdateVideosFlowContext";
import UpdateVideoFlowStepTemplate from "./UpdateVideoFlowStepTemplate";

interface SheetUploadStep { }

export default function SheetUploadStep({ }: SheetUploadStep): React.JSX.Element {
  const { flowData, updateFlowData } = useUpdateVideosFlow();

  return (
    <UpdateVideoFlowStepTemplate>
      <FileUpload
        file={flowData.sheet ?? null}
        onFileChange={(newValue: File) => {
          updateFlowData({
            sheet: newValue,
            sheetPath: window.api.fileManager.getFilePath(newValue)
          });
        }}
      />
    </UpdateVideoFlowStepTemplate>
  );
}