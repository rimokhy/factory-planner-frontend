import {Component, Input, OnInit} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {isNil} from "lodash";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-amount-picker',
  standalone: true,
    imports: [
        MatFormField,
        MatInput,
        MatLabel,
        ReactiveFormsModule
    ],
  templateUrl: './amount-picker.component.html',
  styleUrl: './amount-picker.component.scss'
})
export class AmountPickerComponent implements OnInit {
  @Input() amountSelected!: BehaviorSubject<number>;
  itemNumberFormControl = new FormControl<number | null>(null);

  ngOnInit() {
    this.itemNumberFormControl.setValue(0)

    this.amountSelected.subscribe(value => {
      if (!isNil(value)) {
        this.itemNumberFormControl.setValue(value);
      }
    })
    this.itemNumberFormControl.valueChanges.subscribe(value => {
      if (!isNil(value) && value !== this.amountSelected.value) {
        this.amountSelected.next(value)
      }
    })
  }
}
