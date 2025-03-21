export class ControllerNotFoundException extends Error {
  constructor() {
    super("Controller not found");
  }
}
