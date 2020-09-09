export class Message {
  constructor(
      public sender: string,
      public pin: number,
      public paired = false,
  ) { }
}
