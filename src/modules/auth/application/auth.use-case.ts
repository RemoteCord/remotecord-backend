import { Injectable } from "@nestjs/common";
import axios from "axios";
import type { UserData } from "../types/auth";

@Injectable()
export class AuthUseCase {
    constructor() { }

    async getUserInfo(accessToken: string) {
        const response = await axios.get(
            "https://openidconnect.googleapis.com/v1/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );
        console.log("user info", response.data);
        return response.data as UserData; // Contains user's profile information
    }

}