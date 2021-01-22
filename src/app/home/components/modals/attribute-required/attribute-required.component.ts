import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-attribute-required',
  templateUrl: './attribute-required.component.html',
  styleUrls: ['./attribute-required.component.css']
})
export class AttributeRequiredComponent implements OnInit {

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

  attributeForm = this.fb.group({ 
    attributes: this.fb.array([
      this.fb.control('', Validators.required)
    ])
  });

  get attributes() {
    return this.attributeForm.get('attributes') as FormArray;
  }

  addAttributes() {
    this.attributes.push(this.fb.control(''));
  }

}
