import { 
    Directive, 
    Input, OnInit, 
    HostBinding, Renderer2, ElementRef } from "@angular/core";
import { BehaviorSubject, interval } from 'rxjs';
import { switchMap, takeWhile, tap } from 'rxjs/operators';

import { Letter } from '../models/app.models';

@Directive({
    selector: '[letterScroll]'
})
export class LetterScrollDirective implements OnInit {
    @HostBinding('style.top') topDistance: string;
    @Input() activeLetter: Letter;
    @Input() activeLevel: number;
    @Input() activeScore: number
    public intervalSubject = new BehaviorSubject<number>(1000);

    constructor(private elRef: ElementRef, private renderer: Renderer2) {}

    ngOnInit() {
        this.intervalSubject.pipe(
            switchMap(i => 
                interval(i)
                    .pipe(
                        tap((inter) => {
                            this.topDistance = 10 * inter + 'px';
                        }),
                    )
            )
        ).subscribe();
    }

}