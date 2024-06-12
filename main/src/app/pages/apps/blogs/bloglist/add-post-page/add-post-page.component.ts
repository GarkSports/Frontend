import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService } from 'src/app/services/posts.service';
import { BlogPosts } from 'src/models/posts.model';

@Component({
  selector: 'app-add-post-page',
  templateUrl: './add-post-page.component.html'
})
export class AddPostPageComponent {
  postForm: FormGroup;
  postid: any;


  constructor(
    public router: Router,
    activatedRouter: ActivatedRoute,
    private PostService: PostsService,
    private fb: FormBuilder
  ){
    this.postid = activatedRouter.snapshot.paramMap.get('id');
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      subtitle: ['', Validators.required],
      body: ['', Validators.required],
      category: ['', Validators.required],
      imageUrl: ['', [Validators.required]],
      publicAudience: ['', [Validators.required]],
      
    });

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

}
