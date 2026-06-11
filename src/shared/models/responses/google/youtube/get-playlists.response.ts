import { youtube_v3 } from "googleapis"

export type PlaylistInGetPlaylistsResponse = {} & youtube_v3.Schema$Playlist

export type GetPlaylistsResponse = {
  nextPageToken: string | null,
  playlists: Array<PlaylistInGetPlaylistsResponse>
}