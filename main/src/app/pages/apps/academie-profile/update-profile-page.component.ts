import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Academie } from 'src/models/academie.model';
import { AcademieService } from 'src/app/services/academie.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-update-profile-page',
  templateUrl: './update-profile-page.component.html',
})
export class UpdateProfilePageComponent implements OnInit {
  academie: Academie;
  uploadingImage: boolean = false;

  constructor(private route: ActivatedRoute, private academieService: AcademieService, private router: Router, private firestorage: AngularFireStorage,) {}

  ngOnInit(): void {
    this.getAcademie();
  }

  getAcademie(): void {
    // Use ActivatedRoute to get the ID from the route parameters
    const idString = this.route.snapshot.paramMap.get('id');
    if (idString) {
      const id = parseInt(idString, 10); // Convert the string to a number
      this.academieService.getAcademieById(id).subscribe((data) => {
        this.academie = data;
      });
    } else {
      console.error('ID parameter is null');
    }
  }
  

  onSave(newdAcademie: Academie): void {
    const academieData = {
      nom: newdAcademie.nom,
      fraisAdhesion: newdAcademie.fraisAdhesion,
      description: newdAcademie.description,
      rue: newdAcademie.rue,
      ville: newdAcademie.ville,
      codePostal: newdAcademie.codePostal,
      pays: newdAcademie.pays,
      logo: newdAcademie.logo
    };
    const updatedAcademie: Partial<Academie> = { ...academieData };
    this.academieService.updateAcademieProfile(updatedAcademie as Academie).subscribe(() => {
      // Redirect back to the academie profile page after saving
      // You can also navigate to any other page as needed
      // Replace '/academie-profile' with the appropriate route
      this.router.navigate(['/apps/academieprofile']);
    });
  }

  onBack(): void {
    // Navigate back to the previous page
    window.history.back();
  }

  async uploadFile(event: any) {
    this.uploadingImage = true;
    const file = event.target.files[0];
    if (file) {
      const path = `academie/${file.name}`;
      const uploadTask = this.firestorage.upload(path, file);
      uploadTask.then(async (snapshot) => {
        const url = await snapshot.ref.getDownloadURL();
        console.log('Image URL:', url);
        this.uploadingImage = false;
        this.academie.logo = url; // Update the updatedAcademie.logo with the new URL
      }).catch(error => {
        console.error('Error uploading image:', error);
      }).finally(() => {
        this.uploadingImage = false; // Reset uploadingImage flag regardless of success or failure
      });
    } else {
      this.uploadingImage = false; // Reset uploadingImage flag if no file is selected (canceled)
    }
  }
}
