import { 
  Component, 
  OnInit 
} from '@angular/core';

import { 
  Observable,
  Subscription 
} from 'rxjs';

import { Letter, State } from './models/app.models';
import { AppService } from './app.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  state$: Subscription;
  letters$: Observable<Letter[]>;
  score: number;
  level: number;

  constructor(private appService: AppService) {}

  ngOnInit() {
    console.clear();
    this.state$ = this.appService.stateObs()
      .subscribe();
    this.letters$ = this.appService.selector('letters');
  }

  xOffset(value: Letter) {
    return value.yPos + 'px';
  }

  gameStatus() {
    return this.appService.getGameStatus;
  }

  test() {
    this.appService.gameStatus.subscribe(console.log);
  }
}
