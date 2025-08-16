import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isSidebarOpen: boolean = true;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  sidebarSections = [
    // {
    //   title: 'Dashboard',
    //   items: [
    //     { label: 'Default', icon: 'fas fa-list-ul', link: '#' }
    //   ]
    // },
    // {
    //   title: 'Authentication',
    //   items: [
    //     { label: 'Login', icon: 'fas fa-sign-in-alt', link: '#' },
    //     { label: 'Register', icon: 'fas fa-user-plus', link: '#' }
    //   ]
    // },
    {
      title: 'Manage',
      items: [
                { label: 'Dashboard', icon: 'fas fa-text-height', link: '/dashboard' },

        { label: 'Tài khoản', icon: 'fas fa-text-height', link: '/users' },
        { label: 'Sách', icon: 'fas fa-palette', link: '/books' },
        { label: 'Combo sách', icon: 'fas fa-palette', link: '/combos' },
        { label: 'Thể loại sách', icon: 'fas fa-palette', link: '/genres' },
                { label: 'Mã khuyến mãi', icon: 'fas fa-palette', link: '/vouchers' },

        { label: 'Đơn hàng', icon: 'fas fa-icons', link: '/orders' }
      ]
    },
    // {
    //   title: 'UI Components',
    //   items: [
    //     { label: 'Typography', icon: 'fas fa-text-height', link: '#' },
    //     { label: 'Colors', icon: 'fas fa-palette', link: '#' },
    //     { label: 'Ant Icons', icon: 'fas fa-icons', link: '#' }
    //   ]
    // },
    // {
    //   title: 'Other',
    //   items: [
    //     { label: 'Sample Page', icon: 'fas fa-globe', link: '#' },
    //     { label: 'Document', icon: 'fas fa-question-circle', link: '#' }
    //   ]
    // }
  ];
}
