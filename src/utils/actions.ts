import { connect } from "react-redux";
import { Observable, of } from "rxjs";
import { catchError, filter, map, mergeMap } from "rxjs/operators";
import { createAsyncAction, EmptyAC, isActionOf, PayloadAC, RootState } from "typesafe-actions";
import { AppEpic } from "../types";

export const asyncAction = <TRequest, TResponse>(name: string) => {
  return createAsyncAction(`${name}_REQUEST`, `${name}_SUCCESS`, `${name}_FAILURE`)<TRequest, TResponse, string>();
};

interface ActionCreator<TRq, TRs> {
  request: PayloadAC<string, TRq> | EmptyAC<string>;
  success: PayloadAC<string, TRs>;
  failure: PayloadAC<string, string>;
}

type Execute<TRq, TRs> = (p: TRq, s: RootState) => Observable<TRs>;

export const requestEpic = <TRq, TRs>(ac: ActionCreator<TRq, TRs>, ex: Execute<TRq, TRs>) => {
  const epic: AppEpic = (action$, state$) =>
    action$.pipe(
      filter(isActionOf(ac.request)),
      mergeMap(a => ex({ payload: {}, ...a }.payload as TRq, state$.value).pipe(
        map(ac.success),
        catchError((e: string) => of(ac.failure(e))),
      )),
    );

  return epic;
};

export class Connector<T, Y> {

  public allProps: T & Y;
  private mapState: (state: RootState) => T;
  private actons: Y;

  constructor(mapState: (state: RootState) => T, actions: Y) {
    this.mapState = mapState;
    this.actons = actions;
    this.allProps = undefined;
  }

  public connect = () => connect(this.mapState, this.actons);

}
