import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Person {
  id?: number;
  name: string;
  email: string;
  isNew?: boolean;
}


@Component({
  selector: 'app-alarm-master',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './alarm-master.component.html',
  styleUrl: './alarm-master.component.scss'
})
export class AlarmMasterComponent {

  people: Person[] = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
  ];

  nextId = 3;

  addNewRow() {
    // Only allow one new row at a time
    if (!this.people.find(p => p.isNew)) {
      this.people.unshift({ name: '', email: '', isNew: true });
    }
  }

  submitNew(person: Person) {
    if (!person.name.trim() || !person.email.trim()) {
      alert('Both name and email are required!');
      return;
    }
    person.id = this.nextId++;
    person.isNew = false;
  }

  cancelNew(person: Person) {
    this.people = this.people.filter(p => p !== person);
  }

  deletePerson(person: Person) {
    this.people = this.people.filter(p => p !== person);
  }
}
