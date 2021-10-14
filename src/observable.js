import {
  concat,
  of,
  interval,
  Subject
} from 'rxjs';
import {
  takeUntil,
  repeatWhen,
  startWith,
  scan,
  takeWhile,
  share,
  filter,
} from 'rxjs/operators';

import actionTypes from './actionTypes';

const INTERVAL = 250;
const STARTING_NUMBER = 5;
const Messages = {
  Alarm: 'Wake Up!',
  Sleep: 'Have a nice day!'
}

const countdown$ = interval(INTERVAL)
  .pipe(
    startWith(STARTING_NUMBER),
    scan(time => time - 1),
    takeWhile(time => time > 0)
  )
  .pipe(share());

const actions$ = new Subject();

const snooze$ = actions$.pipe(filter(action => action === actionTypes.Snooze));
const dismiss$ = actions$.pipe(filter(action => action === actionTypes.Dismiss));

const snoozeableAlarm$ = concat(countdown$, of(Messages.Alarm))
  .pipe(repeatWhen(() => snooze$));

export const observable$ = concat(
  snoozeableAlarm$.pipe(takeUntil(dismiss$)),
  of(Messages.Sleep)
);

export const dispatch = (actionType = '') => () => actions$.next(actionType);