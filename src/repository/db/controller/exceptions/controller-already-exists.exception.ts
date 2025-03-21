export class ControllerAlreadyExists extends Error {
  constructor() {
    super("Controller already exists");
  }
}

