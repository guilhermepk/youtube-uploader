import { registerDialogSelectFolder } from "./use-cases/dialog-select-folder/dialog-select-folder.ipc";

export function registerFileManagerIpc() {
  registerDialogSelectFolder();
}