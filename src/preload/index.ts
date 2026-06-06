import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ContextBridgeApi } from './api.interface'
import { IpcResponse } from '@shared/models/interfaces/ipc-response.interface'
import { IsGoogleAuthenticatedResponse } from '@shared/responses/google/is-google-authenticated.response'

const api: ContextBridgeApi = {
  google: {
    startAuth: (): Promise<IpcResponse<null>> => ipcRenderer.invoke('google/start-auth'),
    isAuthenticated: (): Promise<IpcResponse<IsGoogleAuthenticatedResponse>> => ipcRenderer.invoke('google/is-authenticated'),
    onAuthSuccess(callback: (payload: { email: string }) => void) {
      const subscription = (_event: Electron.IpcRendererEvent, payload: { email: string }) => callback(payload);
      ipcRenderer.on('google-auth-success', subscription);
      return () => ipcRenderer.removeListener('google-auth-success', subscription);
    },
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
