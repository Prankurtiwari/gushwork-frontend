import {
  Component,
  OnInit,
  Renderer2,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  SlotMachineService,
  Session,
  RollResult,
} from './slot-machine.service';

@Component({
  selector: 'app-slot-machine',
  standalone: false,
  templateUrl: './slot-machine.component.html',
  styleUrls: ['./slot-machine.component.css'],
})
export class SlotMachineComponent implements OnInit {
  session?: Session;
  // Displayed contents for the 3 slots: initially empty.
  displayedSymbols: string[] = ['', '', ''];
  isSpinning: boolean = false;
  message: string = '';
  credits: number = 0;

  // Styling for the cash-out button's dynamic movement.
  cashOutButtonStyle: any = {};
  cashOutDisabled: boolean = false;

  // Using ViewChild to reference the cash-out button (if needed).
  @ViewChild('cashOutButton', { static: false }) cashOutButton!: ElementRef;

  constructor(
    private slotMachineService: SlotMachineService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    // On init, create a session so that the user gets starting credits.
    this.slotMachineService.startSession().subscribe(
      (sess) => {
        this.session = sess;
        this.credits = sess.credits;
      },
      () => {
        this.message = 'Error starting session!';
      }
    );
  }

  // Called when the "START GAME" button is clicked.
  startGame(): void {
    if (!this.session) {
      this.message = 'No session available. Please refresh the page.';
      return;
    }

    this.isSpinning = true;
    this.message = 'Spinning...';
    // Set all slot cells to a spinning state (represented by "X").
    this.displayedSymbols = ['X', 'X', 'X'];

    // Call the server to perform a roll.
    this.slotMachineService.roll(this.session.sessionId).subscribe(
      (result: RollResult) => {
        // Update credits based on win/loss.
        this.credits = result.balance;
        if (result.isWinner) {
          this.message = `You win +${result.reward} credits!`;
        } else {
          this.message = 'You lost!';
        }

        // Stagger update of the 3 blocks.
        setTimeout(() => {
          this.displayedSymbols = result.symbols; // First letter of first symbol.
        }, 1000);

        setTimeout(() => {
          this.displayedSymbols = result.symbols;
        }, 2000);

        setTimeout(() => {
          this.displayedSymbols = result.symbols;
          this.isSpinning = false;
        }, 3000);
      },
      (error) => {
        this.message = 'Roll error: ' + error;
        this.isSpinning = false;
      }
    );
  }

  // Called on mouseover of the "CASH OUT" button.
  onCashOutHover(): void {
    const randomNum = Math.random(); // Value between 0 and 1.
    // 50% chance to move the button randomly by 300px.
    if (randomNum < 0.5) {
      const directions = ['left', 'right', 'top', 'bottom'];
      const randomDir =
        directions[Math.floor(Math.random() * directions.length)];
      this.cashOutButtonStyle = {
        [randomDir]: '300px',
        transition: 'all 0.3s',
      };
    }
    // 40% chance to disable the button temporarily.
    else if (randomNum < 0.9) {
      this.cashOutDisabled = true;
      setTimeout(() => {
        this.cashOutDisabled = false;
      }, 1000);
    }
    // Otherwise, do nothing.
  }

  // Called when the "CASH OUT" button is clicked.
  cashOut(): void {
    if (!this.session) {
      this.message = 'No active session!';
      return;
    }
    this.slotMachineService.cashOut(this.session.sessionId).subscribe(
      (creditsCashed: number) => {
        this.message = `Cash out successful! ${creditsCashed} credits have been moved to your account.`;
        // Reset session.
        this.credits = 0;
        this.session = undefined;
      },
      (error) => {
        this.message = 'Cash out error: ' + error;
      }
    );
  }
}
