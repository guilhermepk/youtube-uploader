import { useState } from "react";
import UpdateVideoFlowStepTemplate from "./UpdateVideoFlowStepTemplate";
import { FolderSelect } from "@renderer/components/FolderSelect";

export default function DownloadStep(): React.JSX.Element {
  const [folderPath, setFolderPath] = useState<string | null>(null);

  return (
    <UpdateVideoFlowStepTemplate>
      <p className="text-white">Selecione a pasta e o download será feito</p>

      <FolderSelect folderPath={folderPath} onPathChange={setFolderPath} />
    </UpdateVideoFlowStepTemplate>
  );
}