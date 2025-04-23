import { Controller, Get, Query, Redirect } from "@nestjs/common";
import { CONTROLLER_ROUTE } from "../route.constants";
import axios from "axios";
import { ControllerRepository } from "@/src/repository/db/controller/controller.repository";
import { ConfigService } from "@nestjs/config";
import { Configuration } from "@/src/config/env.enum";

// https://discord.com/oauth2/authorize?client_id=1043524973517615164&response_type=code&redirect_uri=https%3A%2F%2Fapi2.luqueee.dev%2Fapi%2Fcontrollers%2Fget-email&scope=email

@Controller(CONTROLLER_ROUTE)
export class ControllerDiscordRoutes {
    constructor(private readonly controllerRepository: ControllerRepository, private readonly configService: ConfigService) { }

    @Get("get-email")
    @Redirect('https://discord.gg/A3uVqEHr', 301)

    async getEmail(@Query("code") code: string) {


        const BASE_API_URL = this.configService.get(Configuration.BASE_API_URL);
        const tokens = await fetch(
            "https://discord.com/api/oauth2/token",
            {
                method: "POST",
                body: new URLSearchParams({
                    client_id: "1043524973517615164",
                    client_secret: "d140s1ucKHQ1ADPaTDj0tnGiT4OH__iu",
                    grant_type: "authorization_code",
                    code,
                    redirect_uri: `${BASE_API_URL}/api/controllers/get-email`,

                }).toString(),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        ).then(async (res) => await res.json()) as {
            access_token: string;
            expires_in: number;
            refresh_token: string;
            scope: string;
            token_type: string;

        }

        const userData = await fetch(
            "https://discord.com/api/users/@me",
            {

                headers: {
                    Authorization: `${tokens.token_type} ${tokens.access_token}`,
                },
            }
        ).then(async (res) => await res.json()) as {
            id: string;
            username: string;
            email: string;
            avatar: string;
            locale: string;
            verified: boolean;
        }

        console.log(tokens, userData);

        await this.controllerRepository.create({
            controllerid: userData.id,
            email: userData.email,
            name: userData.username,
            picture: `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}`,
            locale: userData.locale,
        }).catch((error) => {
            console.error("Error creating controller", error);
        }
        );



        return {
            status: true
        }
    }
}