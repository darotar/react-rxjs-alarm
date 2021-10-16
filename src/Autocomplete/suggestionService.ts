import { BehaviorSubject, Observable } from "rxjs";
import { ajax, AjaxResponse } from "rxjs/ajax";
import { map, filter, switchMap, debounceTime } from "rxjs/operators";

import { Suggestion } from "./types";

const getApiUrl = (value: string) =>
  `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${value}&apikey=4TPH2WLZAG4H8KW7`;

const transformResponse = ({ response }: AjaxResponse<any>): Suggestion[] => {
  return response.bestMatches.map((item: any) => ({
    symbol: item["1. symbol"],
    name: item["2. name"],
  }));
};

export const getSuggestions = (
  subject: BehaviorSubject<string>
): Observable<Suggestion[]> =>
  subject.pipe(
    debounceTime(500),
    filter((v) => v.length > 2),
    map(getApiUrl),
    switchMap((url) => ajax<any>(url)),
    map(transformResponse)
  );

export const subject$ = new BehaviorSubject<string>("");
