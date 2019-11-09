import { Component, OnInit } from '@angular/core';
import { TrainingService } from './training.service';
import { Observable } from 'rxjs';
import * as fromTraining from './training.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit {
  public ongoingTraining$: Observable<boolean>;
  // public exerciseSubscription: Subscription;

  constructor(
    private trainingService: TrainingService,
    private store: Store<fromTraining.State>
    ) { }

  ngOnInit() {
    this.ongoingTraining$ = this.store.select(fromTraining.getIsTraining);
    // this.exerciseSubscription = this.trainingService.startTraining.subscribe((runningExercise) => {
    //   runningExercise ? this.ongoingTraining = true : this.ongoingTraining = false;
    // });
  }

}
