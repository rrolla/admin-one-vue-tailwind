import {
  mdiAccountCircle,
  mdiAlertCircle,
  mdiDesktopMac,
  mdiLock,
  mdiMonitorShimmer,
  mdiResponsive,
  mdiSquareEditOutline,
  mdiTable,
  mdiTelevisionGuide,
  mdiViewList
} from '@mdi/js'

export default [
  'General',
  [
    {
      to: '/',
      icon: mdiDesktopMac,
      label: 'Dashboard'
    },
    {
      href: '/climbing-goose/feeds',
      label: 'Feeds',
      icon: mdiMonitorShimmer,
      target: '_blank'
    },
    {
      to: '/media',
      icon: mdiViewList,
      label: 'Media'
    },
    {
      to: '/streams',
      icon: mdiTelevisionGuide,
      label: 'Streams'
    },
  ],
  // 'Examples',
  // [
  //   {
  //     to: '/tables',
  //     label: 'Tables',
  //     icon: mdiTable,
  //     updateMark: true
  //   },
  //   {
  //     to: '/forms',
  //     label: 'Forms',
  //     icon: mdiSquareEditOutline
  //   },
  //   {
  //     to: '/ui',
  //     label: 'UI',
  //     icon: mdiTelevisionGuide
  //   },
  //   {
  //     to: '/responsive',
  //     label: 'Responsive',
  //     icon: mdiResponsive
  //   },
  //   {
  //     to: '/profile',
  //     label: 'Profile',
  //     icon: mdiAccountCircle
  //   },
  //   {
  //     to: '/login',
  //     label: 'Login',
  //     icon: mdiLock
  //   },
  //   {
  //     to: '/error',
  //     label: 'Error',
  //     icon: mdiAlertCircle
  //   },
  //   {
  //     label: 'Submenus',
  //     subLabel: 'Submenus Example',
  //     icon: mdiViewList,
  //     menu: [
  //       {
  //         label: 'Sub-item One'
  //       },
  //       {
  //         label: 'Sub-item Two'
  //       }
  //     ]
  //   }
  // ],
  'Tools',
  [
    {
      href: '/telescope',
      label: 'Telescope',
      icon: mdiMonitorShimmer,
      target: '_blank'
    },
    {
      href: '/horizon',
      label: 'Horizon',
      icon: mdiMonitorShimmer,
      target: '_blank'
    },
    {
      href: '/supervisor',
      label: 'Supervisor',
      icon: mdiMonitorShimmer,
      target: '_blank'
    },
  ]
]
