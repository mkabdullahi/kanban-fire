import { Component } from '@angular/core';

import { Task } from './task/task.interface';

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
 ]
}
