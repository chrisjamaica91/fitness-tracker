import { Exercise } from './exercise.model';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map, take } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { UIService } from '../shared/ui.service';
import * as UI from '../shared/ui.actions';
import * as fromTraining from './training.reducer';
import { Store } from '@ngrx/store';
import * as Training from './training.actions';

@Injectable()
export class TrainingService {
  private fbSubs: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UIService,
    private store: Store<fromTraining.State>
    ) {}

  public fetchAvailableExercises() {
    this.store.dispatch(new UI.StartLoading());
    this.fbSubs.push(this.db
    .collection('Available Exercises')
    .snapshotChanges()
    .pipe(
     map(docArray => {
     return docArray.map(doc => {
        const data = doc.payload.doc.data() as Exercise;
        const id = doc.payload.doc.id;
        return {id, ...data};
      });
    })
   )
   .subscribe((exercises: Exercise[]) => {
     this.store.dispatch(new UI.StopLoading());
     this.store.dispatch(new Training.SetAvailableTrainings(exercises));
    //  this.availableExercises = exercises;
    //  this.exercisesChanged.next([...this.availableExercises]);
   }, error => {
      this.store.dispatch(new UI.StopLoading());
      this.uiService.showSnackbar('Fetching Exercises failed, please try again later', null, 3000);
   }));
  }

  startExercise(selectedId: string) {
    // this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);
    // this.startTraining.next({...this.runningExercise});
    this.store.dispatch(new Training.StartTraining(selectedId));
  }

  completeExercise() {
    this.store.select(fromTraining.getActiveTraining)
    .pipe(take(1))
    .subscribe(ex => {
      this.addDatatoDatabase({
        ...ex,
        date: new Date(),
        state: 'completed'
      });
      // this.runningExercise = null;
      // this.startTraining.next(null);
      this.store.dispatch(new Training.StopTraining());
    });
  }

  cancelExercise(progress: number) {
    this.store.select(fromTraining.getActiveTraining)
    .pipe(take(1))
    .subscribe(ex => {
      this.addDatatoDatabase({
        ...ex,
        duration: ex.duration * (progress / 100),
        calories: ex.calories * (progress / 100),
        date: new Date(),
        state: 'cancelled'
      });
      // this.runningExercise = null;
      // this.startTraining.next(null);
      this.store.dispatch(new Training.StopTraining());
    });
  }

  fetchCompletedOrCancelledExercises() {
    this.fbSubs.push(this.db.collection('finishedExercises')
    .valueChanges()
    .subscribe((exercises: Array<Exercise>) => {
      this.store.dispatch(new Training.SetFinishedTrainings(exercises));
      // this.finishedExercisesChanged.next(exercises);
    }));
  }

  public cancelSubscriptions() {
    this.fbSubs.forEach( sub => sub.unsubscribe());
  }

  private addDatatoDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }
}
