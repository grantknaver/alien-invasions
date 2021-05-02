  import { 
    fromEvent,
    Observable, 
    BehaviorSubject,
    Subject
  } from 'rxjs';
  
  import {   
    map,
    scan,
    filter,
    share, 
    takeUntil,
    throttleTime
  } from 'rxjs/operators';

  import { State, GameStatistics } from './models/app.models';


import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class AppService {
    public gameStatus =  new BehaviorSubject<GameStatistics>({score: 0, level: 1});
    public gameTerminated = new Subject();

    get getGameStatus() {
      return this.gameStatus.getValue();
  }

    keysObs(): Observable<string> {
        return fromEvent(document, 'keydown').pipe(
            throttleTime(500),
            map((e: KeyboardEvent ) => e.key),
            filter(k => k.charCodeAt(0) >= 97 && k.charCodeAt(0) <= 122),
            share(),
            takeUntil(this.gameTerminated)
        );
    }

    stateObs() {
        return this.keysObs().pipe(
            scan<string, State>(
              (state, value, i) => (
                {
                  letters:[
                    {
                      letter: value,
                      yPos: Math.floor(Math.random() * 500),
                    },
                    ...state.letters
                  ],
                  score: this.getGameStatus.score,
                  level: this.getGameStatus.level
                }
              ),
              {letters:[], score: 0, level: 1}
            ),
            share(),
            takeUntil(this.gameTerminated)
          ) 
    }

    selector(selection: string) {
        return this.stateObs().pipe(
            map(state => state[selection]),
        );
    }
}