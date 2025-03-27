import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import * as ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import type { ColDef } from 'ag-grid-community';
import { AgGridAngular } from 'ag-grid-angular';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.css'
})
export class UsersListComponent implements OnInit {
  users: any[] = [];
  totalCount: number = 0;
  totalPages: number = 0;
  currentPage: number = 1;
  pageSize: number = 5;
  searchText: string = '';
  villageNames: string[] = [
    'Amalapuram',
    'Ravulapalem',
    'Mandapeta',
    'Rajahmundry',
    'Hyderabad',
    'Kakinada',
    'Vijayawada',
    'Amaravathi',
    'Pitapuram',
    'Vizag',
    'Chennai',
    'Banglore',
    'Mysore',
    'Ooty',
    'Coorg',
    'Araku',
    'Srikakulam',
  ];
  
  filteredVillages: string[] = [];
  isTyping = false;
  filteredUsers: any[] = []; // Holds filtered user list
  public Editor = ClassicEditor;
  public editorData = '<p>Type something here...</p>';
  filterUsers() {
    if (this.searchText.trim() === '') {
      // If search text is empty, display all users
      this.filteredUsers = this.users;
    } else {
      // Filter users based on the search text
      this.filteredUsers = this.users.filter(
        (user) =>
          user.firstName
            .toLowerCase()
            .includes(this.searchText.toLowerCase()) ||
          user.lastName.toLowerCase().includes(this.searchText.toLowerCase()) ||
          user.address.toLowerCase().includes(this.searchText.toLowerCase()) ||
          user.dob.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  }

  // Filter village names as the user types
  filterVillages() {
    const input = this.userFormData.address.toLowerCase();
    this.filteredVillages = this.villageNames.filter((village) =>
      village.toLowerCase().startsWith(input)
    );

    // Hide the list if input is empty
    if (!input) {
      this.filteredVillages = [];
    }
  }

  // Select a village from suggestions
  selectVillage(village: string) {
    this.userFormData.address = village;
    this.filteredVillages = []; // Clear suggestions after selection
  }

  userFormData = {
    id: '',
    firstName: '',
    lastName: '',
    dob: '',
    address: '',
  } as {
    id?: string;
    firstName: string;
    lastName: string;
    dob: string;
    address: string;
  };
  activeUser: any | null = null;

  setActiveUser(user: any): void {
    this.activeUser = user;
  }
  isEditMode = false;

  constructor(
    private userService: UserService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private router: Router
  ) {}

  redirectToEffect() {
    this.router.navigate(['/effect']); // Navigate to effect page
  }
  ngOnInit() {
    this.fetchUsers();
    this.loadUsers(this.currentPage, this.pageSize);
  }
  loadUsers(pageNumber: number, pageSize: number): void {
    this.userService
      .getPagedUsers(pageNumber, pageSize)
      .subscribe((response) => {
        this.users = response.users;
        this.totalCount = response.totalCount;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize);
        this.currentPage = response.currentPage;
        this.filterUsers();
      });
  }

  // Navigate to the next page
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadUsers(this.currentPage, this.pageSize);
    }
  }

  // Navigate to the previous page
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadUsers(this.currentPage, this.pageSize);
    }
  }

  // Navigate to a specific page
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadUsers(this.currentPage, this.pageSize);
    }
  }
  fetchUsers() {
    this.userService.getAllUsers().subscribe(
      (response) => {
        console.log('Fetched users:', response);
        this.users = response;
      },
      (error) => {
        console.error('Error fetching users:', error); // Detailed log
        alert('Failed to fetch users. Check console for details.');
      }
    );
  }

  submitData() {
    const formDataToSubmit = { ...this.userFormData };

    if (!this.isEditMode) {
      delete formDataToSubmit.id; // Don't send ID when adding a new user
    }

    if (this.isEditMode) {
      // Update existing user
      this.userService.updateUser(formDataToSubmit).subscribe(
        (response) => {
          alert('User updated successfully');
          this.resetForm();
          this.isEditMode = false;

          // Find the index of the updated user and replace it in the list
          const userIndex = this.users.findIndex(
            (user) => user.id === response.id
          );
          if (userIndex !== -1) {
            this.users[userIndex] = response; // Update the user in the list
          }

          // Reload users with correct pagination
          this.loadUsers(this.currentPage, this.pageSize);
        },
        (error) => {
          console.error('Error updating user:', error);
          alert('Failed to update user. Check console for details.');
        }
      );
    } else {
      // Add new user
      this.userService.addUser(formDataToSubmit).subscribe(
        (response) => {
          alert('User added successfully');
          this.resetForm();
          this.users.push(response); // Assuming the response contains the added user

          // Check if we need to adjust the page
          this.totalCount++; // Increment total count after adding user

          // Check if the new user pushed the current page beyond the total pages
          if (this.users.length > this.pageSize) {
            this.totalPages = Math.ceil(this.totalCount / this.pageSize);
            if (this.currentPage < this.totalPages) {
              this.currentPage++; // Move to next page if necessary
            }
          }

          this.loadUsers(this.currentPage, this.pageSize); // Reload users with the correct page
        },
        (error) => {
          console.error('Error adding user:', error);
          alert('Failed to add user. Check console for details.');
        }
      );
      this.cdr.detectChanges();
    }
  }

  deleteUser(userId: string): void {
    this.userService.deleteUser(userId).subscribe(
      () => {
        // Remove the deleted user from the local array
        this.users = this.users.filter((user) => user.id !== userId);

        // Update total count and check if we need to go to the previous page
        this.totalCount--;
        if (this.users.length === 0 && this.currentPage > 1) {
          this.currentPage--; // Go to the previous page if no users are left on the current page
        }

        // If the deleted user is the one being edited, reset the form
        if (this.userFormData.id === userId) {
          this.resetForm(); // Unbind the form
          this.isEditMode = false; // Exit edit mode
        }

        alert('User deleted successfully.');
        this.loadUsers(this.currentPage, this.pageSize); // Reload users with updated page
      },
      (error) => {
        console.error('Error deleting user:', error);
        alert('Failed to delete the user.');
      }
    );
  }

  editUser(user: any): void {
    // Format the date to 'YYYY-MM-DD' if it's in a different format
    this.userFormData = {
      ...user,
      dob: this.datePipe.transform(user.dob, 'yyyy-MM-dd'),
    };
    this.isEditMode = true; // Set edit mode
  }

  cancelEdit() {
    this.resetForm();
    this.isEditMode = false; // Exit edit mode
  }

  resetForm() {
    this.userFormData = {
      id: '', // Reset ID as well
      firstName: '',
      lastName: '',
      dob: '',
      address: '',
    };
  }

}
