import { Component } from '@angular/core';

import { Task, TaskDialogResult} from './task/task.interface';
import {
        CdkDragDrop,
        transferArrayItem,
        moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
 todos: Task[] = [
    {
      title: 'Buy Milk',
      description: 'Go to the store and buy milk'
    },
    {
      title: 'Create a Kanban app',
      description: 'Using Firebase and Angular framework'
    },
    {
      title: 'Add authentication',
      description: 'Use firebase auth'
    }
  ];
  inProgress: Task[] = [];
  done: Task[] = [];

  constructor(private matDialog: MatDialog){}

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
          this.todos.push(result.task);
        })
  }

  editTask(list: string, task: Task): void {}

  drop(event: CdkDragDrop<Task[]>): void {

    if(event.previousContainer === event.container) {
      return;
    }
    if(!event.container.data || !event.previousContainer.data){
      return;
    }
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
    moveItemInArray(
      this.todos,
      event.previousIndex,
      event.currentIndex
    )
  }

}
