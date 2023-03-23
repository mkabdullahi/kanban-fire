import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AppComponent } from './app.component';
import { TaskComponent } from './task/task.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
const MATERIAL_IMPORT = [
  MatToolbarModule,
  MatIconModule,
  MatCardModule
]

@NgModule({
  declarations: [
    AppComponent,
    TaskComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DragDropModule,
    ...MATERIAL_IMPORT
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
