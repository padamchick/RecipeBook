import { Pipe, PipeTransform } from '@angular/core';
import { orderBy } from 'lodash';

@Pipe({ name: 'sortBy' })
export class SortPipe implements PipeTransform {

  transform(value: any[], order = "", column: string = ""): any[] {
    if (!value || value.length === 0 || order === "" || !order) {
      return value;
    }

    if (!column || column === "") {
      if (order === "desc") {
        return value.sort().reverse();
      } else {
        return value.sort();
      }
    }

    let sorted = value.sort((a, b) => {
      if (a[column] > b[column]) {
        return 1;
      } else {
        return -1;
      }
    });
    if (order === "asc") {
      return sorted;
    } else {
      return sorted.reverse();
    }
  }
}
