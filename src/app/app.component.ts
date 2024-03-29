import { Component } from '@angular/core';

import { Task, TaskDialogResult} from './task/task.interface';
import {
        CdkDragDrop,
        transferArrayItem,
       } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, BehaviorSubject } from 'rxjs';

const getObservable = (collection: AngularFirestoreCollection<Task>) => {

      const subject = new BehaviorSubject<Task[]>([]);
      collection.valueChanges({idField: 'id'}).subscribe((val: Task[]) => {
        subject.next(val);
      })
      return subject;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
            private matDialog: MatDialog,
            private store: AngularFirestore
            ){}

  todos = getObservable(this.store.collection('todos')) as Observable<Task[]>;
  inProgress = getObservable(this.store.collection('inProgress')) as Observable<Task[]>;
  done = getObservable(this.store.collection('done')) as Observable<Task[]>;

  newTask(): void {
      const dialogRef = this.matDialog.open(TaskDialogComponent, {
        width: '277px',
        data: {
          task: {},
        },
      });
      dialogRef.afterClosed()
        .subscribe((result: TaskDialogResult | undefined) => {
          if(!result) {
            return;
          }
          this.store.collection('todos').add(result.task);
        })
  }

  editTask(list: 'done' | 'todos' | 'inProgress', task: Task): void {
    const dialogRef = this.matDialog.open(TaskDialogComponent, {
      width: '277px',
      data: {
        task,
        enableDelete: true
      }
    } );
    dialogRef.afterClosed().subscribe((result: TaskDialogResult | undefined) => {
      if(!result){
        return;
      }
      if(result.delete) {
       this.store.collection(list).doc(task.id).delete();
      }else{
        this.store.collection(list).doc(task.id).update(task);
      }
    })
  }

  drop(event: CdkDragDrop<Task[] | null>): void {

    if(event.previousContainer === event.container) {
      return;
    }
    if(!event.previousContainer.data || !event.container.data){
      return;
    }
   const item = event.previousContainer.data[event.previousIndex];
   this.store.firestore.runTransaction( ()=> {
    const taskPromise = Promise.all([
      this.store.collection(event.previousContainer.id).doc(item.id).delete(),
      this.store.collection(event.container.id).add(item),
    ]);
    return taskPromise;
   })
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }

}
