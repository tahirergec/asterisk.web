import {Component} from "@angular/core";

@Component({
  selector: "call-list",
  template: `
    <form>
      <div class="container">
        <div class="row">
          <div class="col-md-2">
            <div class="form-group">
              <label for="date_start">Дата начала</label>
              <input class="form-control" id="date_start" type="text">
            </div>
          </div>
          <div class="col-md-2">
            <div class="form-group">
              <label for="date_end">Дата окончания</label>
              <input class="form-control" id="date_end" type="text">
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group">
              <label for="dial_type">Тип вызова</label>
              <select id="dial_type" class="form-control">
                <option>Входящие</option>
                <option>Исходящие</option>
              </select>
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-group">
              <label for="dial_dest">Назначение вызова</label>
              <input class="form-control" id="dial_dst" type="text">
            </div>
          </div>
          <div class="col-md-2">
            <div class="form-group">
              <label for="dial_src">Инициатор вызова</label>
              <input class="form-control" id="dial_src" type="text">
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-2 col-md-offset-5">
            <button type="submit" class="btn btn-primary btn-block">
              <i class="fa fa-filter"></i> Фильтровать
            </button>
          </div>
        </div>
        <hr>
      </div>
    </form>
  `
})
export class CallListComponent {

}
