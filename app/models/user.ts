interface IUser {
  username: string;

  is_anonymous?: boolean;
}

export class User implements IUser {
  username: string;

  public is_anonymous = false;

  constructor(username: string) {
    this.username = username;
  }
}

export class AnonymousUser extends User {
  public is_anonymous = true;

  constructor(){
    super("Anonymous");
  }
}
