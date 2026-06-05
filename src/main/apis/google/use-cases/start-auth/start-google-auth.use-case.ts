import { tryCatch } from '../../../../common/utils/try-catch'
import { Inject, Injectable } from '@nestjs/common'
import http from 'http'
import url from 'url';
import { googleAuthHtmlResponse } from "./google-auth-html-response";
import { Auth } from 'googleapis';
import { BrowserWindow, shell } from 'electron';
import { BadGatewayError } from '../../../../../shared/models/errors/bad-gateway.error';
import { SaveGoogleTokenUseCase } from '../../../../secure-data-manager/use-cases/save-google-token.use-case';

@Injectable()
export class StartGoogleAuthUseCase {
  constructor(
    @Inject(Auth.OAuth2Client)
    private readonly oAuth2Client: Auth.OAuth2Client,

    @Inject(SaveGoogleTokenUseCase)
    private readonly saveGoogleTokenUseCase: SaveGoogleTokenUseCase
  ) { }

  async execute(): Promise<void> {
    return await tryCatch(async () => {
      let server: http.Server | null = null;

      try {
        server = http.createServer(async (request, response) => {
          if (request.url) {
            const querySearch = new url.URL(request.url, 'http://localhost:3000').searchParams;
            const code: string | null = querySearch.get('code');

            response.end(googleAuthHtmlResponse);
            server?.close();

            if (code) {
              const tokens = await this.oAuth2Client.getToken(code).then(res => res.tokens);
              const { access_token: accessToken, refresh_token: refreshToken } = tokens;

              if (accessToken && refreshToken) {
                this.oAuth2Client.setCredentials({ access_token: accessToken, refresh_token: refreshToken });

                await this.saveGoogleTokenUseCase.execute({ accessToken, refreshToken })

                const tokenInfo = await this.oAuth2Client.getTokenInfo(accessToken)
                  .catch(() => null);

                BrowserWindow.getAllWindows().forEach((win) => {
                  win.webContents.send('google-auth-success', { email: tokenInfo?.email ?? null });
                });

              } else throw new BadGatewayError('Não foi possível obter os tokens de autenticação do Google');
            }
          }
        }).listen(3000);

        const authUrl: string = this.oAuth2Client.generateAuthUrl({
          access_type: 'offline',
          scope: [
            'openid',
            'https://www.googleapis.com/auth/userinfo.email',
            'https://www.googleapis.com/auth/youtube'
          ]
        });

        shell.openExternal(authUrl);
      } catch (error) {
        if (server && server.listening) server.close();
        throw error;
      }
    }, 'Erro ao iniciar autenticação no Google')
  }
}
