import { Component, Inject, Optional, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { BlogPosts } from 'src/models/posts.model';
import { PostsService } from 'src/app/services/posts.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { EquipeService } from 'src/app/services/equipe.service';
import { Discipline } from 'src/models/discipline.model';



@Component({
  selector: 'app-blogs',
  templateUrl: './blog.component.html',
})
export class AppBloglistComponent implements AfterViewInit {
  @ViewChild(MatTable, { static: false }) table: MatTable<any> =
    Object.create(null);
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator = Object.create(null);
  searchText: any;
  totalCount = -1;
  Closed = -1;
  Inprogress = -1;
  Open = -1;
  


  displayedColumns: string[] = [
 'createdAt',
    'title',
    'author',
    'category',
    'publicAudience',
    'action',
  ];

  
  
  
  dataSource = new MatTableDataSource<BlogPosts>([]);
 
  constructor(
    public dialog: MatDialog,
    public postservice: PostsService,
   
    ) {}

  ngOnInit(): void {
    // this.Open = this.btnCategoryClick('Open');
    // this.Closed = this.btnCategoryClick('Closed');
    // this.Inprogress = this.btnCategoryClick('InProgress');
    
    
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.getPosts();
    this.totalCount = this.dataSource.data.length;
    
  }
  
  getPosts(): void {
    this.postservice.getPosts().subscribe(
      (posts) => {
        console.log('posts fetched in list view', posts);
        this.dataSource.data = posts;
        console.log('data', this.dataSource.data);
      },
      (error) => {
        console.error('Error fetching posts in list view', error);
      }
    );
  }

  

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  btnCategoryClick(val: string): number {
    this.dataSource.filter = val.trim().toLowerCase();
    return this.dataSource.filteredData.length;
  }

  openDialog(action: string, obj: any): void {
    obj.action = action;
    const dialogRef = this.dialog.open(AppBlogDialogContentComponent, {
      data: obj,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.event === 'Ajouter') {
        this.addRowData(result.data);
      } else if (result.event === 'Modifier') {
        this.updateRowData(result.data);
      } else if (result.event === 'Supprimer') {
        this.deleteRowData(result.data);
      }
    });
  }
  // tslint:disable-next-line - Disables all
  addRowData(row_obj: BlogPosts): void {
    this.postservice.addPost(row_obj).subscribe(
      (response) => {
        console.log('Post added successfully:', response);
        // If you want to refresh the table after adding the post, you can fetch the posts again
        this.getPosts();
      },
      (error) => {
        console.error('Error adding post:', error);
        // Handle error
      }
    );
  }
  

  // tslint:disable-next-line - Disables all
  updateRowData(row_obj: BlogPosts): void {
    const id = row_obj.id;
    const updatedData = { ...row_obj }; // Assuming you have updated data
    this.postservice.updatePost(id, updatedData).subscribe(
      (response) => {
        console.log('Post updated successfully:', response);
        // If you want to refresh the table after updating the post, you can fetch the posts again
        this.getPosts();
      },
      (error) => {
        console.error('Error updating post:', error);
        // Handle error
      }
    );
  }

  // tslint:disable-next-line - Disables all
  deleteRowData(row_obj: BlogPosts): void {
    this.postservice.deletePost(row_obj.id).subscribe(
      () => {
        console.log('Post deleted successfully');
        // If you want to refresh the table after deleting the post, you can fetch the posts again
        this.getPosts();
      },
      (error) => {
        console.error('Error deleting post:', error);
        // Handle error
      }
    );
  }

  

}

@Component({
  // tslint:disable-next-line - Disables all
  selector: 'app-dialog-content',
  templateUrl: 'blog-dialog-content.html',
})
// tslint:disable-next-line - Disables all
export class AppBlogDialogContentComponent {
  action: string;
  // tslint:disable-next-line - Disables all
  local_data: any;
  disciplines: Discipline[] = [];
  uploadingImage: boolean = false;

  constructor(
    private firestorage: AngularFireStorage,
    public dialogRef: MatDialogRef<AppBlogDialogContentComponent>,
    private equipeService: EquipeService,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: BlogPosts
  ) {
    this.local_data = { ...data };
    this.action = this.local_data.action;
    this.getDisciplines();

  }

  getDisciplines(): void {
    this.equipeService.getDisciplines()
      .subscribe(disciplines => this.disciplines = disciplines);
  }

  doAction(): void {
    this.dialogRef.close({ event: this.action, data: this.local_data });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
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
