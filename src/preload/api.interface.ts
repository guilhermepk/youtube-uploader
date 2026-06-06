import { IpcResponse } from "@shared/models/interfaces/ipc-response.interface"
import { IsGoogleAuthenticatedResponse } from "@shared/responses/google/is-google-authenticated.response"

export interface ContextBridgeApi {
  google: {
    startAuth: () => Promise<IpcResponse<null>>,
    isAuthenticated: () => Promise<IpcResponse<IsGoogleAuthenticatedResponse>>,
    onAuthSuccess: (callback: (payload: { email: string | null }) => void) => (() => void),
  }
}