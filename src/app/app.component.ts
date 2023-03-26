import { Component } from '@angular/core';

import { Task, TaskDialogResult} from './task/task.interface';
import {
        CdkDragDrop,
        transferArrayItem,
        moveItemInArray } from '@angular/cdk/drag-drop';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

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

  todos = this.store.collection('todos').valueChanges({idField: 'id' }) as Observable<Task[]>;
  inProgress = this.store.collection('inProgress').valueChanges({idField: 'id'}) as Observable<Task[]>;
  done = this.store.collection('done').valueChanges({idField: 'id'}) as Observable<Task[]>;

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
