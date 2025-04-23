import { Controller, Get, Query, Redirect, Res } from "@nestjs/common";
import { AUTH_ROUTE } from "../route.constants";
import type { FastifyReply } from "fastify";
import axios from "axios";
import { CreateUserUseCase } from "../../application/create-user-use-case/create-user.use-case";
import { AuthUseCase } from "../../application/auth.use-case";

@Controller(AUTH_ROUTE)
export class AuthController {
    constructor(private readonly createUserUseCase: CreateUserUseCase, private readonly authUseCase: AuthUseCase) { }

    @Get("callback")
    async callback(@Res() res: FastifyReply, @Query('code') code: string,
    ) {

        const redirectUri = 'https://api2.luqueee.dev/api/auth/callback';
        try {
            const tokens = (await axios.post('https://oauth2.googleapis.com/token', null, {
                params: {
                    code,
                    client_id: process.env.GOOGLE_CLIENT_ID,
                    client_secret: process.env.GOOGLE_CLIENT_SECRET,
                    redirect_uri: redirectUri,
                    grant_type: 'authorization_code',
                },
            })).data;

            console.log(tokens);


            const user_data = await this.authUseCase.getUserInfo(tokens.access_token);

            await this.createUserUseCase.execute({
                name: user_data.name,
                email: user_data.email,
                picture: user_data.picture,
                clientid: user_data.sub,
            });

            const appDeepLink = `remotecord://callback?token=${tokens.id_token}`;

            res.header('Content-Type', 'text/html');

            // Instead of redirect(), send HTML with a script
            return res.send(`
      <html>
        <body>
          <script>
            window.location.href = "${appDeepLink}";
          </script>
          <p>If you are not redirected automatically, <a href="${appDeepLink}">click here</a>.</p>
        </body>
      </html>
    `);
        } catch (error) {
            console.error('Error during authentication:', error);
            return res.status(500).send('Authentication failed');
        }


    }
}