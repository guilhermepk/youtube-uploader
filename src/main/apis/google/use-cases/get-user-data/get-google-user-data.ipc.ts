import { IpcResponse } from "@shared/models/interfaces/ipc-response.interface";
import { GetGoogleUserDataResponse } from "@shared/responses/google/get-google-user-data.response";
import { GetGoogleUserDataUseCase } from "./get-google-user-data.use-case";
import createIpcHandler from "@main/common/utils/create-ipc-handler";

export function registerGetGoogleUserDataIpc() {
  async function handler(
    useCase: GetGoogleUserDataUseCase
  ): Promise<IpcResponse<GetGoogleUserDataResponse>> {
    return {
      success: true,
      data: await useCase.execute()
    }
  }

  createIpcHandler(
    'google/get-user-data',
    handler,
    {
      useCaseClass: GetGoogleUserDataUseCase
    }
  );
}