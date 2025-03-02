import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SlotMachineModule } from './slot-machine/slot-machine.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, SlotMachineModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
