import { IpcResponse } from "@shared/models/interfaces/ipc-response.interface"

export interface ContextBridgeApi {
  google: {
    startAuth: () => Promise<IpcResponse<null>>
  }
}