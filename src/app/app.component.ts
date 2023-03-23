import { Component } from '@angular/core';

import { Task } from './task/task.interface';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';

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
  }
}
