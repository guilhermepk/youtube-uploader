import { registerGoogleIpc } from './apis/google/google.ipc'
import { registerFileManagerIpc } from './file-manager/file-manager.ipc';

export function registerNestAppIpc() {
  registerGoogleIpc();
  registerFileManagerIpc();
}
