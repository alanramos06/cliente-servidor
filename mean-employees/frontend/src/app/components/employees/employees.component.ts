import { Component, OnInit } from '@angular/core';

import { EmployeeService } from '../../services/employee.service';
import { NgForm } from '../../../../node_modules/@angular/forms';
import { Employee } from '../../models/employee';

declare var M: any;

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css'],
  providers: [EmployeeService]
})
export class EmployeesComponent implements OnInit {

  constructor(private employeeService: EmployeeService) { }

  ngOnInit() {
    this.getEmployees();
  }

  addEmployee(form: NgForm) {
    this.employeeService.postEmployee(form.value)
      .subscribe(res => {
        this.resetForm(form);
        M.toast({html: 'Save successfuly'});
        this.getEmployees();
      })
  }

  getEmployees() {
    this.employeeService.getEmployees()
      .subscribe(res => {
        this.employeeService.employees = res as Employee[];
      });
  }

  resetForm(form?: NgForm) {
    if(form){
      form.reset();
      this.employeeService.selectedEmployee = new Employee();
    }
  }

}
