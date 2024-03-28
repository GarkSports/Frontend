import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { blogService } from './blogService.service';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss'],
})
export class AppBlogsComponent implements OnInit {
  
  constructor(
    public router: Router,
    public blogService: blogService,
    public PostsService: PostsService,
  ){

  }
  selectBlog(b:string){
    this.blogService.detailId = b;
    this.router.navigate(['apps/blog/detail', b]);
  }

  ngOnInit(): void {
    this.PostsService.getPosts().subscribe((d: any) => (this.PostsService.blogPosts = d));
     
  }
  // filterFeaturedPost = this.blogPosts.filter(function (item) {
  //   return item.featuredPost == true;
  // });
  // filterBasicPost = this.blogPosts.filter(function (item) {
  //   return item.featuredPost == false;
  // });
}
