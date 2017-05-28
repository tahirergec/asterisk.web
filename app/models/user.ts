interface IUser {
  username: string;
  session_id: string;

  is_anonymous?: boolean;
}

export class User implements IUser {
  username: string;
  session_id: string;

  public is_anonymous = false;

  constructor(username: string, session_id: string) {
    this.username = username;
    this.session_id = session_id;
  }

  public to_json(): string {
    return JSON.stringify({"username": this.username, "session_id": this.session_id});
  }

  public static from_json(params: string): User {
    const user_data = JSON.parse(params);
    return new User(user_data.username, user_data.session_id);
  }
}

export class AnonymousUser extends User {
  public is_anonymous = true;

  constructor(){
    super("Anonymous", "");
  }
}
