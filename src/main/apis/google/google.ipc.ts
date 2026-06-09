import { registerGetGoogleUserDataIpc } from "./use-cases/get-user-data/get-google-user-data.ipc";
import { registerStartGoogleAuthIpc } from "./use-cases/start-auth/start-google-auth.ipc";

export function registerGoogleIpc() {
  registerStartGoogleAuthIpc();
  registerGetGoogleUserDataIpc();
}
