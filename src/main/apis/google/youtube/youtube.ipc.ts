import { registerGetPlaylistsIpc } from "./use-cases/get-playlists/get-playlists.ipc";

export function registerYoutubeIpc() {
  registerGetPlaylistsIpc();
}