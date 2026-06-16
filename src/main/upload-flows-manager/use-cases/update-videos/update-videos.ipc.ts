import { IpcResponse } from "@shared/models/interfaces/ipc-response.interface";
import { UpdateVideosUseCase } from "./update-videos.use-case";
import { UpdateVideosDto } from "@shared/models/dtos/upload-flow-manager/update-videos.dto";
import { UpdateVideosResponse } from "@shared/models/responses/upload-flows-manager/update-videos.response";
import createIpcHandler from "@main/common/utils/create-ipc-handler";

export function registerUpdateVideosIpc(): void {
  async function handler(
    payload: UpdateVideosDto,
    useCase: UpdateVideosUseCase
  ): Promise<IpcResponse<UpdateVideosResponse>> {
    return {
      success: true,
      data: await useCase.execute(payload)
    }
  }

  createIpcHandler(
    'upload-flows/update-videos',
    handler,
    {
      useCaseClass: UpdateVideosUseCase,
      dtoClass: UpdateVideosDto
    }
  )
}