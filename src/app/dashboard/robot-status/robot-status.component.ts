import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface CardItem {
  id: number;
  title: string;
  value: boolean;
}

interface Button {
  id: number;
  title: string;
  value: boolean;
}

@Component({
  selector: 'app-robot-status',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './robot-status.component.html',
  styleUrl: './robot-status.component.scss'
})
export class RobotStatusComponent {
  scaraRobotLabel: CardItem[] = [
    { id: 1, title: "ROBOT MODE", value: true },
    { id: 2, title: "CONTROLLER STATUS", value: false },
    { id: 3, title: "PROGRAM STATUS", value: true },
  ];

  lcmrPallet1Label: CardItem[] = [
    { id: 1, title: "LCMR MODE", value: true },
    { id: 2, title: "CONTROLLER STATUS ", value: false },
    { id: 3, title: "PROGRAM STATUS", value: true },
    { id: 4, title: "PALLET-1 ACTUAL POS ", value: false },
    { id: 5, title: "PALLET-1 ACTUAL SPEED", value: true },
    { id: 6, title: "PALLET-1 JOG SPEED ", value: false },
    { id: 7, title: "PALLET-1 TARGET POS", value: true },
    { id: 7, title: "PALLET-1 TARGET SPEED", value: true }
  ];

  lcmrPallet2Label: CardItem[] = [
    { id: 1, title: "LCMR MODE", value: true },
    { id: 2, title: "CONTROLLER STATUS ", value: false },
    { id: 3, title: "PROGRAM STATUS", value: true },
    { id: 4, title: "PALLET-2 ACTUAL POS ", value: false },
    { id: 5, title: "PALLET-2 ACTUAL SPEED", value: true },
    { id: 6, title: "PALLET-2 JOG SPEED ", value: false },
    { id: 7, title: "PALLET-2 TARGET POS", value: true },
    { id: 7, title: "PALLET-2 TARGET SPEED", value: true }
  ];

  toggleItemValue(cardItem: CardItem): void {
    cardItem.value = !cardItem.value;
  }

  getCardClass(card: CardItem): string {
    return card.value ? 'true' : 'false';
  }

  scaraRobotButtons: Button[] = [
    { id: 1, title: "ABORT PROGRAM", value: true },
    { id: 2, title: "HOME PROGRAM", value: false },
    { id: 3, title: "MAIN PROGRAM", value: true },
    { id: 4, title: "INITIALIZE PROGRAM", value: false },
    { id: 5, title: "PAUSE PROGRAM", value: true },
    { id: 6, title: "ERROR ACKNOWLEDGE", value: true },
    { id: 7, title: "CONTINUE PROGRAM", value: false },
    { id: 8, title: "START PROGRAM", value: true }
  ];

  lcmrPallet1Buttons: Button[] = [
    { id: 1, title: "PALLET-1 HOME", value: true },
    { id: 2, title: "PALLET-1 INITIALIZE", value: false },
    { id: 3, title: "PALLET-1 OP ENABLE", value: true },
    { id: 4, title: "PALLET-1 JOG FORWARD", value: false },
    { id: 5, title: "PALLET-1 JOG REVERSE", value: true },
    { id: 6, title: "PALLET-1 START ", value: true },
    { id: 7, title: "PALLET-1 STOP", value: false },
    { id: 8, title: "ERROR ACKNOWLEDGE", value: true }
  ];
  lcmrPallet2Buttons: Button[] = [
    { id: 1, title: "PALLET-2 HOME", value: true },
    { id: 2, title: "PALLET-2 INITIALIZE", value: false },
    { id: 3, title: "PALLET-2 OP ENABLE", value: true },
    { id: 4, title: "PALLET-2 JOG FORWARD", value: false },
    { id: 5, title: "PALLET-2 JOG REVERSE", value: true },
    { id: 6, title: "PALLET-2 START ", value: true },
    { id: 7, title: "PALLET-2 STOP", value: false },
    { id: 8, title: "ERROR ACKNOWLEDGE", value: true }
  ];
}
