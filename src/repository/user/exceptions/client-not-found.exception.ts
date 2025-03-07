export class ClientNotFoundException extends Error {
  constructor(clientid?: string) {
    super(`Client ${clientid ?? ""} not found`);
  }
}
