import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-recipe',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.scss'
})
export class RecipeComponent implements OnInit {
// Static data for dropdown
categories: any[] = [
  { id: 1, name: 'Production Line A', fields: ['', '', '', '', '', ''], color: '#4e73df' },
  { id: 2, name: 'Quality Control', fields: ['', '', '', '', '', ''], color: '#1cc88a' },
  { id: 3, name: 'Maintenance', fields: ['', '', '', '', '', ''], color: '#f6c23e' },
  { id: 4, name: 'Inventory', fields: ['', '', '', '', '', ''], color: '#e74a3b' },
  { id: 5, name: 'Shipping', fields: ['', '', '', '', '', ''], color: '#36b9cc' }
];

filteredCategories: any[] = [];
selectedCategory: any = null;
recentSelections: any[] = [];
dataForm: FormGroup;
newCategoryForm: FormGroup;
searchTerm: string = '';
isDropdownOpen: boolean = false;

constructor(private fb: FormBuilder, private modalService: NgbModal) {
  this.dataForm = this.fb.group({
    field1: [''],
    field2: [''],
    field3: [''],
    field4: [''],
    field5: [''],
    field6: ['']
  });

  this.newCategoryForm = this.fb.group({
    name: ['', Validators.required],
    color: ['#4e73df'],
    field1: [''],
    field2: [''],
    field3: [''],
    field4: [''],
    field5: [''],
    field6: ['']
  });
}

ngOnInit(): void {
  this.filteredCategories = [...this.categories];
  this.recentSelections = [...this.categories.slice(0, 3)]; // Demo recent items
}

toggleDropdown(): void {
  this.isDropdownOpen = !this.isDropdownOpen;
}

filterCategories(): void {
  this.filteredCategories = this.categories.filter(cat => 
    cat.name.toLowerCase().includes(this.searchTerm.toLowerCase())
  );
}

onCategorySelect(category: any): void {
  this.selectedCategory = category;
  this.isDropdownOpen = false;
  this.updateRecentSelections(category);
  this.dataForm.patchValue({
    field1: category.fields[0] || '',
    field2: category.fields[1] || '',
    field3: category.fields[2] || '',
    field4: category.fields[3] || '',
    field5: category.fields[4] || '',
    field6: category.fields[5] || ''
  });
}

updateRecentSelections(category: any): void {
  this.recentSelections = this.recentSelections.filter(c => c.id !== category.id);
  this.recentSelections.unshift(category);
  if (this.recentSelections.length > 5) {
    this.recentSelections.pop();
  }
}

openAddNewModal(content: any): void {
  this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then(
    (result) => {
      if (result === 'save') {
        this.addNewCategory();
      }
    },
    (reason) => {}
  );
}

addNewCategory(): void {
  if (this.newCategoryForm.valid) {
    const newCategory = {
      id: Math.max(...this.categories.map(c => c.id), 0) + 1,
      name: this.newCategoryForm.value.name,
      color: this.newCategoryForm.value.color,
      fields: [
        this.newCategoryForm.value.field1,
        this.newCategoryForm.value.field2,
        this.newCategoryForm.value.field3,
        this.newCategoryForm.value.field4,
        this.newCategoryForm.value.field5,
        this.newCategoryForm.value.field6
      ]
    };

    this.categories.push(newCategory);
    this.filteredCategories.push(newCategory);
    this.selectedCategory = newCategory;
    this.updateRecentSelections(newCategory);
    this.newCategoryForm.reset({ color: '#4e73df' });
  }
}

save(): void {
  if (this.selectedCategory) {
    this.selectedCategory.fields = [
      this.dataForm.value.field1,
      this.dataForm.value.field2,
      this.dataForm.value.field3,
      this.dataForm.value.field4,
      this.dataForm.value.field5,
      this.dataForm.value.field6
    ];
    // Show success feedback
    this.showToast('Success', 'Category saved successfully!', 'success');
  }
}

saveAs(): void {
  const newName = prompt('Enter new category name:', `${this.selectedCategory.name} - Copy`);
  if (newName) {
    const newCategory = {
      id: Math.max(...this.categories.map(c => c.id), 0) + 1,
      name: newName,
      color: this.selectedCategory.color,
      fields: [
        this.dataForm.value.field1,
        this.dataForm.value.field2,
        this.dataForm.value.field3,
        this.dataForm.value.field4,
        this.dataForm.value.field5,
        this.dataForm.value.field6
      ]
    };

    this.categories.push(newCategory);
    this.filteredCategories.push(newCategory);
    this.selectedCategory = newCategory;
    this.updateRecentSelections(newCategory);
    this.showToast('Success', 'New category created!', 'success');
  }
}

deleteCategory(): void {
  if (this.selectedCategory && confirm(`Are you sure you want to delete "${this.selectedCategory.name}"?`)) {
    this.categories = this.categories.filter(c => c.id !== this.selectedCategory.id);
    this.filteredCategories = this.filteredCategories.filter(c => c.id !== this.selectedCategory.id);
    this.recentSelections = this.recentSelections.filter(c => c.id !== this.selectedCategory.id);
    this.selectedCategory = null;
    this.dataForm.reset();
    this.showToast('Deleted', 'Category removed successfully', 'warning');
  }
}

pushToPLC(): void {
  // Implement PLC push logic here
  this.showToast('Success', 'Data pushed to PLC successfully!', 'success');
}

private showToast(title: string, message: string, type: string): void {
  // In a real app, you would use a toast service here
  console.log(`${title}: ${message}`);
  // Example: this.toastService.show(message, { classname: `bg-${type} text-light`, delay: 5000 });
}
}
