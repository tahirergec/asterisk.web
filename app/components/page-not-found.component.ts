import {Component} from "@angular/core";

@Component({
  template: `
    <div class="row">
      <div class="col-md-12 col-sm-12 col-xs-12">
        <div class="x_panel">
          <div class="x_title">
            <h2>404 - Страница не найдена</h2>
            <div class="clearfix"></div>
          </div>
          <div class="x_content">
            <p>Страница была удалена или еще не создана</p>
            <p>Пожалуйста, вернитесь на <a routerLink=""><i class="fa fa-home"></i> главную страницу</a> и повторите запрос</p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PageNotFoundComponent {

}
