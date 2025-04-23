import { ControllerRepository } from '@/src/repository/db/controller/controller.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PatreonService {
    constructor(private readonly controllerRepository: ControllerRepository) { }

    async createPatreonWebhook(
        email: string
    ) {
        // Logic to create a Patreon webhook



        await this.controllerRepository.updatePermiumStatus(email, true)

        return true
    }
}
