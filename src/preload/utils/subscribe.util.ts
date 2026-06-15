import { SubscriptionResponse } from "@shared/models/responses/subscription.response";
import { ipcRenderer } from "electron";

export function subscribe(channel: string, callback: (...any: any[]) => void): SubscriptionResponse {
  const subscription = (_event: Electron.IpcRendererEvent, payload: { email: string }) => callback(payload);
  ipcRenderer.on(channel, subscription);
  return { removeListener: () => ipcRenderer.removeListener(channel, subscription) };
}