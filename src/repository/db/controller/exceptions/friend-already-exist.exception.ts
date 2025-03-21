export class FriendAlreadyExist extends Error {
  constructor() {
    super("Friend already exists");
  }
}
