import { FaChartBar, FaHome, FaTasks, FaThList, FaUndoAlt, FaUserAlt } from 'react-icons/fa';

export const menu_item = [
  {
    id: 1,
    name: 'Home',
    active: true,
    link: '/',
    icon: <FaHome />,
  },
  {
    id: 2,
    name: 'Manage User',
    active: false,
    link: '/manage_user',
    icon: <FaUserAlt />,
  },
  {
    id: 3,
    name: 'Manage Asset',
    active: false,
    link: '/manage_asset',
    icon: <FaThList />,
  },
  {
    id: 4,
    name: 'Manage Assignment',
    active: false,
    link: '/manage_assignment',
    icon: <FaTasks />,
  },
  {
    id: 5,
    name: 'Request for Returning',
    active: false,
    link: '/request_for_returning',
    icon: <FaUndoAlt />,
  },
  {
    id: 6,
    name: 'Report',
    active: false,
    link: '/report',
    icon: <FaChartBar />,
  },
];
