import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SlotMachineComponent } from './slot-machine/slot-machine.component';

@NgModule({
  declarations: [SlotMachineComponent],
  imports: [CommonModule, FormsModule],
  exports: [SlotMachineComponent],
})
export class SlotMachineModule {}
