import {Injectable, Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: "calls_filter"
})
@Injectable()
export class CallsPipe implements PipeTransform {
  transform(calls: any[], linkedid : string): any[] {
    if (!calls) return [];
    return calls.filter(call => call.linkedid != linkedid && call.active_call);
  }
}
