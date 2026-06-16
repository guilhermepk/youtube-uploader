import { registerDownloadAndRenameIpc } from "./use-cases/download-and-rename/download-and-rename.ipc";
import { registerUpdateVideosIpc } from "./use-cases/update-videos/update-videos.ipc";

export function registerUploadFlowManagerIpc(): void {
  registerDownloadAndRenameIpc();
  registerUpdateVideosIpc();
}