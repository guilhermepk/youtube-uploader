import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ContextBridgeApi } from './api.interface'
import { IpcResponse } from '@shared/models/interfaces/ipc-response.interface'
import { GetGoogleUserDataResponse } from '@shared/responses/google/get-google-user-data.response'
import { GetPlaylistsResponse } from '@shared/responses/google/youtube/get-playlists.response'

const api: ContextBridgeApi = {
  google: {
    startAuth: (): Promise<IpcResponse<null>> => ipcRenderer.invoke('google/start-auth'),
    getUserData: (): Promise<IpcResponse<GetGoogleUserDataResponse>> => ipcRenderer.invoke('google/get-user-data'),
    onAuthSuccess(callback: (payload: { email: string }) => void) {
      const subscription = (_event: Electron.IpcRendererEvent, payload: { email: string }) => callback(payload);
      ipcRenderer.on('google-auth-success', subscription);
      return () => ipcRenderer.removeListener('google-auth-success', subscription);
    },

    youtube: {
      getPlaylists: (): Promise<IpcResponse<GetPlaylistsResponse>> => ipcRenderer.invoke('google/youtube/get-playlists')
    }
  }
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
