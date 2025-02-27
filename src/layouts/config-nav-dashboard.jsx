import { paths } from 'src/routes/paths';

import { CONFIG } from 'src/config-global';

import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`${CONFIG.site.basePath}/assets/icons/navbar/${name}.svg`} />;

const ICONS = {
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
  parameter: icon('ic-parameter'),
  company: icon('ic-banking'),
  menu: icon('ic-ecommerce')
};

// ----------------------------------------------------------------------

export const navData = [
  /**
   * Overview
   */
  {
    subheader: 'Overview',
    items: [
      { title: 'Dashboard', path: paths.dashboard.root, icon: ICONS.dashboard },
      { title: 'Companies', path: paths.dashboard.company.root, icon: ICONS.company },
      { title: 'Master Menu', path: paths.dashboard.product.root, icon: ICONS.menu },
      { title: 'Orders', path: paths.dashboard.order.root, icon: ICONS.order },
      // { title: 'Analytics', path: paths.dashboard.general.analytics, icon: ICONS.analytics },
      { title: 'Users', path: paths.dashboard.user.list, icon: ICONS.user },
      { title: 'Blog', path: paths.dashboard.post.root, icon: ICONS.blog },
      { title: 'Roles', path: paths.dashboard.root, icon: ICONS.disabled },
      { title: 'Settings', path: paths.dashboard.root, icon: ICONS.lock },
      // {
      //   title: 'Support',
      //   path: paths.dashboard.mail,
      //   icon: ICONS.mail,
      // },
    ],
  },
];
