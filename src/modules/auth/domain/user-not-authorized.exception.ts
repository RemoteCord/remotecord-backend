export class UserNotAuthorized extends Error {
  constructor() {
    super("User not authorized");
  }
}
