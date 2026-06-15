import createIpcHandler from "@main/common/utils/create-ipc-handler";
import { IpcResponse } from "@shared/models/interfaces/ipc-response.interface";
import { dialog } from "electron";

export function registerDialogSelectFolder() {
  async function handler(): Promise<IpcResponse<{ folderPath: string | null }>> {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory'] // Força a selecionar apenas pastas
    });

    let folderPath: string | null = null;

    if (canceled) folderPath = null;
    else folderPath = filePaths[0]; // Retorna a string do caminho absoluto

    return { success: true, data: { folderPath } }
  }

  createIpcHandler('file-manager/dialog-select-folder', handler);
}