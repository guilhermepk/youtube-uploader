import { IpcResponse } from "@shared/models/interfaces/ipc-response.interface";
import { IsGoogleAuthenticatedResponse } from "@shared/responses/google/is-google-authenticated.response";
import { IsGoogleAuthenticatedUseCase } from "./is-google-authenticated.use-case";
import createIpcHandler from "@main/common/utils/create-ipc-handler";

export function registerIsGoogleAuthenticatedIpc() {
  async function handler(
    useCase: IsGoogleAuthenticatedUseCase
  ): Promise<IpcResponse<IsGoogleAuthenticatedResponse>> {
    return {
      success: true,
      data: await useCase.execute()
    }
  }

  createIpcHandler(
    'google/is-authenticated',
    handler,
    {
      useCaseClass: IsGoogleAuthenticatedUseCase
    }
  );
}