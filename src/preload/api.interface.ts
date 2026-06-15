import { IpcResponse } from "@shared/models/interfaces/ipc-response.interface"
import { GetGoogleUserDataResponse } from "@shared/models/responses/google/get-google-user-data.response"
import { GetPlaylistsResponse } from "@shared/models/responses/google/youtube/get-playlists.response"

export interface ContextBridgeApi {
  google: {
    startAuth: () => Promise<IpcResponse<null>>,
    getUserData: () => Promise<IpcResponse<GetGoogleUserDataResponse>>,
    onAuthSuccess: (callback: (payload: { email: string | null }) => void) => (() => void),

    youtube: {
      getPlaylists: () => Promise<IpcResponse<GetPlaylistsResponse>>
    }
  },

  fileManager: {
    dialogSelecFolder: () => Promise<IpcResponse<{ folderPath: string | null }>>
  }
}