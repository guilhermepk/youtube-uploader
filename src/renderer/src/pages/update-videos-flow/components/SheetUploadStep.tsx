import { FileUpload } from "@renderer/components/FileUpload";
import UpdateVideoFlowStepTemplate from "./UpdateVideoFlowStepTemplate";

interface SheetUploadStep {
  file: File | null;
  onFileChange: React.Dispatch<React.SetStateAction<File | null>>
}

export default function SheetUploadStep({
  onFileChange, file
}: SheetUploadStep): React.JSX.Element {
  return (
    <UpdateVideoFlowStepTemplate>
      <FileUpload onFileChange={onFileChange} file={file} />
    </UpdateVideoFlowStepTemplate>
  );
}