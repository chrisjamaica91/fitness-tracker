import { Component, OnInit} from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';
import {  Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromTraining from '../training.reducer';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  public trainings$: Observable<Array<Exercise>>;
  // public exerciseSubscription: Subscription;
  // public loadingExerciseSubscription: Subscription;
  public isLoading$: Observable<boolean>;

  constructor(
    private trainingService: TrainingService,
    private store: Store<fromRoot.State>,
    ) {}

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    // this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(exercises =>
    //   this.trainings = exercises
    //   );
    // this.loadingExerciseSubscription = this.trainingService.loadingExercises.subscribe(isLoading => {
    //   this.isLoading = isLoading;
    // });
    this.trainings$ = this.store.select(fromTraining.getAvailableExercises);
    this.fetchExercises();
  }

  public fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }
}
