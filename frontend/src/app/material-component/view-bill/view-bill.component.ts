import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BillService } from 'src/app/services/bill.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { GlobalConstants } from 'src/app/shared/global-constant';
import { ConfirmationComponent } from '../dialog/confirmation/confirmation.component';
import { ViewBillProductsComponent } from '../dialog/view-bill-products/view-bill-products.component';

@Component({
  selector: 'app-view-bill',
  templateUrl: './view-bill.component.html',
  styleUrls: ['./view-bill.component.scss']
})
export class ViewBillComponent implements OnInit {

  displayedColumns: string[] = ['name', 'email', 'contactNumber', 'paymentMethod', 'total', 'view']
  dataSource: any;
  responseMesage: any;

  constructor(private billService: BillService,
    private snackbarService: SnackbarService,
    private ngxService: NgxUiLoaderService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.tabledata();
  }

  tabledata() {
    this.billService.getBills().subscribe((response: any) => {
      this.ngxService.stop();
      this.responseMesage = response?.message;
      this.dataSource = new MatTableDataSource(response);
    }, (error: any) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMesage = error.error?.message;
      } else {
        this.responseMesage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMesage, GlobalConstants.error)
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  handleViewAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "650px";
    dialogConfig.data = {
      data: values
    }
    const dialogRef = this.dialog.open(ViewBillProductsComponent, dialogConfig);
    this.router.events.subscribe(() => { dialogRef.close() })
  }

  handleReportAction(values: any) {
    this.ngxService.start();
    var data = {
      name: values.name,
      email: values.email,
      contactNumber: values.contactNumber,
      paymentMethod: values.paymentMethod,
      uuid: values.uuid,
      total: values.totalAmount,
      productDetails: values.productDetails
    }
    this.billService.getPdf(data).subscribe((response: any) => {
      this.ngxService.stop();
      this.responseMesage = response?.message;
      this.snackbarService.openSnackBar("Downloaded Successfully", 'Success');
      saveAs(response, values.uuid + '.pdf')
    }, (error: any) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMesage = error.error?.message;
      } else {
        this.responseMesage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMesage, GlobalConstants.error)
    })
  }

  handleDeleteAction(values: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      message: 'delete ' + values.name + ' bill'
    }
    const dialogRef = this.dialog.open(ConfirmationComponent, dialogConfig);
    const sub = dialogRef.componentInstance.onEmitStatusChange.subscribe((response: any) => {
      this.ngxService.start();
      this.deleteBill(values.id);
      dialogRef.close();
    }, (error: any) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMesage = error.error?.message;
      } else {
        this.responseMesage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMesage, GlobalConstants.error)
    })
  }

  deleteBill(id: any) {
    this.billService.delete(id).subscribe((response: any) => {
      this.ngxService.stop();
      this.responseMesage = response?.message;
      this.tabledata();
      this.snackbarService.openSnackBar(this.responseMesage, "Deleted Successfully");
    }, (error: any) => {
      this.ngxService.stop();
      if (error.error?.message) {
        this.responseMesage = error.error?.message;
      } else {
        this.responseMesage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMesage, GlobalConstants.error)
    })
  }
}
