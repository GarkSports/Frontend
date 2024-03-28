import { Component, OnInit } from '@angular/core';
import { blogService } from '../blogService.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService } from 'src/app/services/posts.service';

@Component({
  selector: 'app-blog-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
})
export class AppBlogDetailsComponent implements OnInit{
  title: any;
  blogDetail: any = null;
  
  istoggleReply = true;  
     
  toggleReply() {  
    this.istoggleReply = !this.istoggleReply;  
  }
  activeRoute:any= this.router.url.split('/').pop();

  constructor(
    public router: Router,
    activatedRouter: ActivatedRoute,
    public PostService: PostsService,
  ){
    this.title = activatedRouter.snapshot.paramMap.get('id');
    

  }

  ngOnInit(): void {
    
      this.PostService.getPosts().subscribe((d: any) => (this.PostService.blogPosts = d));
    
    
    this.blogDetail = this.PostService.blogPosts.filter(x => x.title === this.title);
    console.log(this.blogDetail)
  }
}
