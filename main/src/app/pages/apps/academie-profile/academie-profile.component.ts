import { Component, Inject } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AcademieService } from 'src/app/services/academie.service';
import { Academie } from 'src/models/academie.model';

@Component({
  selector: 'app-academie-profile',
  templateUrl: './academie-profile.component.html',
})
export class AcademieProfileComponent {
  academie: Academie;
  constructor(private academieService: AcademieService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getAcademie();
  }

  getAcademie(): void {
    this.academieService.getAcademie().subscribe((data) => {
      this.academie = data;
      console.log(this.academie);
    });
  }

  openUpdateProfileDialog(): void {
    const dialogRef = this.dialog.open(UpdateProfileDialogComponent, {
      data: this.academie // Pass academie data to the dialog
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result === 'updated') {
        this.getAcademie(); // Fetch updated data if the profile was updated
      }
    });
  }
}


@Component({
  selector: 'app-update-profile-dialog',
  templateUrl: './update-profile-dialog.component.html',
})
export class UpdateProfileDialogComponent {
  updatedAcademie: Academie; // Define a property to hold the updated academie

  constructor(
    public dialogRef: MatDialogRef<UpdateProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Academie, // Inject the Academie data
    private academieService: AcademieService,
    private firestorage: AngularFireStorage,
  ) {
    // Initialize the updatedAcademie with the passed Academie data
    this.updatedAcademie = { ...data };
  }

  onSave(): void {
    // Call the service method to update the academie
    this.academieService.updateAcademieProfile(this.updatedAcademie).subscribe(() => {
      // Close the dialog and pass 'updated' as the result
      this.dialogRef.close('updated');
    });
  }

  async uploadFile(event: any) {
    const file = event.target.files[0];
    if (file) {
      const path = `academie/${file.name}`;
      const uploadTask = this.firestorage.upload(path, file);
      uploadTask.then(async (snapshot) => {
        const url = await snapshot.ref.getDownloadURL();
        console.log('Image URL:', url);
        this.updatedAcademie.logo = url; // Update the updatedAcademie.logo with the new URL
      }).catch(error => {
        console.error('Error uploading image:', error);
      });
    }
  }
}

