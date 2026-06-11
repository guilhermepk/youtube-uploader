import { IpcResponse } from "@shared/models/interfaces/ipc-response.interface";
import { GetPlaylistsResponse } from "@shared/models/responses/google/youtube/get-playlists.response";
import { GetPlaylistsUseCase } from "./get-playlists.use-case";
import createIpcHandler from "@main/common/utils/create-ipc-handler";

export function registerGetPlaylistsIpc(): void {
  async function handler(
    useCase: GetPlaylistsUseCase
  ): Promise<IpcResponse<GetPlaylistsResponse>> {
    return {
      success: true,
      data: await useCase.execute()
    };
  }

  createIpcHandler(
    'google/youtube/get-playlists',
    handler,
    {
      useCaseClass: GetPlaylistsUseCase
    }
  );
}