import { registerGoogleIpc } from './apis/google/google.ipc'
import { registerFileManagerIpc } from './file-manager/file-manager.ipc';
import { registerUploadFlowManagerIpc } from './upload-flows-manager/upload-flow-manager.ipc';

export function registerNestAppIpc() {
  registerGoogleIpc();
  registerFileManagerIpc();
  registerUploadFlowManagerIpc();
}
