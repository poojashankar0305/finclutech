import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  public mobile= false;
  public innerWidth: any;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerWidth = window.innerWidth;
    console.log(this.innerWidth);
  }
  ngOnInit() {
  if (window.screen.width === 100) { // 768px portrait
    this.mobile = true;
  }
}
  toggleSidebar() {
    let sidebar = document.getElementById("sidebar") as HTMLInputElement;
    let homeContent = document.getElementById('home-content') as HTMLInputElement;
    sidebar.classList.toggle('active');
    if(sidebar.classList.contains('active')){
      homeContent.classList.add('side-margin')
    }else{
      homeContent.classList.remove('side-margin')
    }
  }
}
