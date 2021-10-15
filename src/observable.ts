import { concat, of, interval, Subject, Observable } from "rxjs";
import {
  takeUntil,
  repeatWhen,
  startWith,
  scan,
  takeWhile,
  share,
  filter,
} from "rxjs/operators";

import { ActionTypes, Messages } from "./enums";

const INTERVAL: number = 250;
const STARTING_NUMBER: number = 5;

const countdown$: Observable<number> = interval(INTERVAL)
  .pipe(
    startWith(STARTING_NUMBER),
    scan((time) => time - 1),
    takeWhile((time) => time > 0)
  )
  .pipe(share());

const actions$ = new Subject();

const snooze$ = actions$.pipe(
  filter((action) => action === ActionTypes.Snooze)
);
const dismiss$ = actions$.pipe(
  filter((action) => action === ActionTypes.Dismiss)
);

const snoozeableAlarm$: Observable<number | Messages> = concat(
  countdown$,
  of(Messages.Alarm)
).pipe(repeatWhen(() => snooze$));

export const observable$: Observable<number | Messages> = concat(
  snoozeableAlarm$.pipe(takeUntil(dismiss$)),
  of(Messages.Sleep)
);

export const dispatch: (actionType: string) => () => void =
  (actionType = "") =>
  () =>
    actions$.next(actionType);
