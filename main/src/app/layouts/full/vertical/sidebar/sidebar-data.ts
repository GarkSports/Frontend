import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    displayName: 'Blog',
    iconName: 'chart-donut-3',
    route: 'apps/blog',
    children: [
      {
        displayName: 'PostsList',
        iconName: 'point',
        route: 'apps/blog/postslist',
      },
      {
        displayName: 'Post',
        iconName: 'point',
        route: 'apps/blog/post',
      },
      
    ],
  },
  {
    displayName: 'Dashboard',
    iconName: 'home',
    route: '/dashboards/dashboard1',
  },
  {
    displayName: 'Managers',
    iconName: 'user-circle',
    route: 'apps/managers',
  },
  {
    displayName: 'Staff',
    iconName: 'user-circle',
    route: 'apps/staff',
  },
  {
    displayName: 'Roles',
    iconName: 'user-circle',
    route: 'apps/roles',
  },
  {
    displayName: 'Profil',
    iconName: 'user-circle',
    route: 'apps/profil',
  },
  {
    displayName: 'Archived Academies',
    iconName: 'building',
    route: 'apps/archivedacademie',
  },
  {
    displayName: 'Academie Profile',
    iconName: 'building',
    route: 'apps/academieprofile',
  },
  {
    displayName: 'Equipe',
    iconName: 'users',
    route: 'apps/equipe',
  },
  {
    displayName: 'Paiement',
    iconName: 'credit-card',
    route: 'apps/paiement',
  },
  {
    displayName: 'Discipline Manager',
    iconName: 'medal',
    route: 'apps/disciplinemanager',
  },
  {
    displayName: 'Discipline',
    iconName: 'medal',
    route: 'apps/discipline',
  },
  {
    displayName: 'Academie',
    iconName: 'building',
    route: 'apps/academie',
  },
  {
    displayName: 'Calendrier',
    iconName: 'calendar-event',
    route: 'apps/calendrier',
  },
  {
    displayName: 'List Evenement',
    iconName: 'star',
    route: 'apps/listevenement',
  },
];
