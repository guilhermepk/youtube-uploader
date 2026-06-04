import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { ContextBridgeApi } from './api.interface'
import { IpcResponse } from '@shared/models/interfaces/ipc-response.interface'

const api: ContextBridgeApi = {
  google: {
    startAuth: (): Promise<IpcResponse<null>> => ipcRenderer.invoke('google/start-auth')
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
