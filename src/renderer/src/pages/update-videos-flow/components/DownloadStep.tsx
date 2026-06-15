import Button from "@renderer/components/Button";
import UpdateVideoFlowStepTemplate from "./UpdateVideoFlowStepTemplate";
import { FolderSelect } from "@renderer/components/FolderSelect";
import { useUpdateVideosFlow } from "@renderer/contexts/UpdateVideosFlowContext";

export default function DownloadStep(): React.JSX.Element {
  const { flowData, updateFlowData } = useUpdateVideosFlow();

  return (
    <UpdateVideoFlowStepTemplate>
      <p className="text-white">Selecione a pasta e o download será feito</p>

      <FolderSelect folderPath={flowData.downloadFolderPath ?? null} onPathChange={(newPath) => updateFlowData({ downloadFolderPath: newPath })} />

      <Button
        disabled={!flowData.downloadFolderPath}
        onClick={() => window.alert('download')}
      >
        Iniciar Download
      </Button>
    </UpdateVideoFlowStepTemplate>
  );
}