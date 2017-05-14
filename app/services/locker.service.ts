import {Injectable, EventEmitter} from "@angular/core";

@Injectable()
export class LockerService {

  private _locked: boolean = false;
  set locked(state: boolean) {
    this._locked = state;
    this.change_state.emit(this.locked);
  }
  get locked(): boolean {
    return this._locked;
  }

  public change_state: EventEmitter<boolean> = new EventEmitter<boolean>();

  public ChangeState(locked: boolean): void {
      this.locked = locked;
  }

  public lock() {
    this.ChangeState(true);
  }

  public unlock() {
    this.ChangeState(false);
  }

}
