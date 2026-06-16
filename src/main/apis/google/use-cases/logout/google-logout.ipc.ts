import { IpcResponse } from "@shared/models/interfaces/ipc-response.interface";
import { GoogleLogoutUseCase } from "./google-logout.use-case";
import createIpcHandler from "@main/common/utils/create-ipc-handler";

export function registerGoogleLogoutIpc(): void {
  async function handler(
    useCase: GoogleLogoutUseCase
  ): Promise<IpcResponse<void>> {
    await useCase.execute();
    return { success: true, data: undefined };
  }

  createIpcHandler('google/logout', handler, { useCaseClass: GoogleLogoutUseCase });
}