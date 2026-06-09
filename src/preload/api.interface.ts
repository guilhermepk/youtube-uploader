import { IpcResponse } from "@shared/models/interfaces/ipc-response.interface"
import { GetGoogleUserDataResponse } from "@shared/responses/google/get-google-user-data.response"

export interface ContextBridgeApi {
  google: {
    startAuth: () => Promise<IpcResponse<null>>,
    getUserData: () => Promise<IpcResponse<GetGoogleUserDataResponse>>,
    onAuthSuccess: (callback: (payload: { email: string | null }) => void) => (() => void),
  }
}