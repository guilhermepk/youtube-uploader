import { IpcResponse } from "@shared/models/interfaces/ipc-response.interface";
import { DownloadAndRenameUseCase } from "./download-and-rename.use-case";
import createIpcHandler from "@main/common/utils/create-ipc-handler";
import { DownloadAndRenameDto } from "@shared/models/dtos/upload-flow-manager/download-and-rename.dto";
import { DownloadAndRenameResponse } from "@shared/models/responses/upload-flows-manager/download-and-rename.response";

export function registerDownloadAndRenameIpc(): void {
  async function handler(
    payload: DownloadAndRenameDto,
    useCase: DownloadAndRenameUseCase
  ): Promise<IpcResponse<DownloadAndRenameResponse>> {
    return {
      success: true,
      data: await useCase.execute(payload)
    }
  }

  createIpcHandler(
    'upload-flows/download-and-rename',
    handler,
    { useCaseClass: DownloadAndRenameUseCase, dtoClass: DownloadAndRenameDto }
  );
}