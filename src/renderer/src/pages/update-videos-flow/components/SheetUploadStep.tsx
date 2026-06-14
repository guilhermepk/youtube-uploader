import { FileUpload } from "@renderer/components/FileUpload";
import Flow2StepTemplate from "./Flow2StepTemplate";

interface SheetUploadStep {
  file: File | null;
  onFileChange: React.Dispatch<React.SetStateAction<File | null>>
}

export default function SheetUploadStep({
  onFileChange, file
}: SheetUploadStep): React.JSX.Element {
  return (
    <Flow2StepTemplate>
      <FileUpload onFileChange={onFileChange} file={file} />
    </Flow2StepTemplate>
  );
}