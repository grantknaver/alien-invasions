import { 
  Component, 
  OnInit 
} from '@angular/core';

import { 
  BehaviorSubject,
  fromEvent,
  Observable, 
  Subscription 
} from 'rxjs';

import {   
  map,
  scan,
  takeWhile,
  filter,
} from 'rxjs/operators';

import { Letter } from './models/app.models';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  keys$: Observable<string>;
  keysState$: Observable<any>;
  score: number;
  level: number;

  ngOnInit() {
    console.clear();
    this.score = 0;
    this.level = 1;
    this.keys$ = fromEvent(document, 'keydown').pipe(
      map((e: KeyboardEvent ) => e.key),
      filter(k => k.charCodeAt(0) >= 97 && k.charCodeAt(0) <= 122),
      takeWhile(k => this.level < 10)
    );
    this.keysState$ = this.keys$.pipe(
      scan<string, Letter[]>(
        (letter, value, i) => ([{
          letter: value,
          yPos: Math.floor(Math.random() * 600),
          score: this.score,
          level: this.level
        },
        ...letter
      ]),
        []
      ),
    ) 
  }

  randomLetter() {
    const alphabetLength = 25;
    return String.fromCharCode(
      Math.random() * alphabetLength + 'a'.charCodeAt(0)
    );
  }

  xOffset(value: Letter) {
    return value.yPos + 'px';
  }
}
