import {EventEmitter, Injectable} from "@angular/core";

@Injectable()
export class ScenarioService {

  public need_reload: EventEmitter<boolean> = new EventEmitter<boolean>();

  public reload_tree() {
    this.need_reload.emit(true);
  }

}
