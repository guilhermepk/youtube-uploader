import { registerDownloadAndRenameIpc } from "./use-cases/download-and-rename/download-and-rename.ipc";

export function registerUploadFlowManagerIpc(): void {
  registerDownloadAndRenameIpc();
}