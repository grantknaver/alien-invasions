import { 
    Directive, 
    Input, 
    OnInit, 
    HostBinding,
    Renderer2
} from "@angular/core";
import { BehaviorSubject, interval } from 'rxjs';
import { 
    switchMap,
    takeWhile, 
    takeUntil,
    tap 
} from 'rxjs/operators';
import { AppService } from "../app.service";

import { Letter } from '../models/app.models';

@Directive({
    selector: '[letterScroll]'
})
export class LetterScrollDirective implements OnInit {
    @HostBinding('style.top') topDistance: string;
    @HostBinding('style.display') letterDisplay: string;

    @Input() activeLetter: Letter;
    public intervalSubject = new BehaviorSubject<number>(300);

    constructor(private appService: AppService) {}

    ngOnInit() {
        this.intervalSubject.pipe(
            switchMap(i => 
                interval(i)
                    .pipe(
                        tap((inter) => {
                            this.topDistance = 10 * inter + 'px';
                            if(inter / 50 !== 0 && Number.isInteger(inter / 50)) { 
                                this.letterDisplay = 'none';
                                this.appService.gameStatus.next({
                                    ...this.appService.getGameStatus, 
                                    score: this.appService.getGameStatus.score + 1
                                })
                                this.levelUpdate();
                            } 
                        }
                        ),
                        takeWhile(() => this.letterDisplay != 'none'),
                        takeUntil(this.appService.gameTerminated)
                    )
            )
        ).subscribe();
    }

    levelUpdate() {
        if (this.appService.getGameStatus.score === 10) {
            this.appService.gameStatus.next({
                ...this.appService.getGameStatus, 
                level: this.appService.getGameStatus.level + 1
            })
            this.appService.gameTerminated.next('You Won');
            alert('You won!')
            window.location.reload();
        }
    }
}