import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EquipeService } from 'src/app/services/equipe.service';
import { PostsService } from 'src/app/services/posts.service';
import { Discipline } from 'src/models/discipline.model';
import { BlogPosts } from 'src/models/posts.model';

@Component({
  selector: 'app-add-post-page',
  templateUrl: './add-post-page.component.html'
})
export class AddPostPageComponent {
  postForm: FormGroup;
  
  local_data: any;
  uploadingImage: boolean = false;
  disciplines: Discipline[] = [];




  constructor(
    public router: Router,
    private firestorage: AngularFireStorage,
    private PostService: PostsService,
    private equipeService: EquipeService,
    private fb: FormBuilder
  ){
    this.getDisciplines();
    
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      subtitle: ['', Validators.required],
      body: ['', Validators.required],
      category: ['', Validators.required],
      imageUrl: ['', [Validators.required]],
      publicAudience: ['', [Validators.required]],
      
    });

  }

  getDisciplines(): void {
    this.equipeService.getDisciplines()
      .subscribe(disciplines => this.disciplines = disciplines);
  }

  add(): void {
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }
    const formValues = this.postForm.value as BlogPosts;
      this.PostService.addPost(formValues).subscribe(
        (response) => {
          console.log('post added successfully', response);
          this.router.navigate(['apps/blog/postslist']); // Replace with your desired route
        },
        (error) => {
          console.error('Error adding post', error);
        }
      );
    
  }

  async uploadFile(event: any) {
    this.uploadingImage = true;
    //display image
    if (!event.target.files[0] || event.target.files[0].length === 0) {
      // this.msg = 'You must select an image';
      return;
    }
    const mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      // this.msg = "Only images are supported";
      return;
    }
    // tslint:disable-next-line - Disables all
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    // tslint:disable-next-line - Disables all
    reader.onload = (_event) => {
      // tslint:disable-next-line - Disables all
      this.local_data.imagePath = reader.result;
    };
    //upload image
    const file = event.target.files[0];
    if(file){
      const path = `academie/${file.name}`;
      const uploadTask = await this.firestorage.upload(path, file);
      const url = await uploadTask.ref.getDownloadURL();
      console.log('Image URL:', url);
      this.local_data.imageUrl = url;
      this.uploadingImage = false;
    }
  }

}
