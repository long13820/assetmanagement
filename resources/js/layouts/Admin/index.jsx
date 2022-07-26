import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { menu_item } from '../../../assets/data/menu_item';
import Logo from '../../../assets/images/logo.png';
import FirstLoginChangePassword from '../../components/Auth/FirstLoginChangePassword';
import Drawer from '../../components/Layouts/Drawer';
import Header from '../../components/Layouts/Header';
import ListGroup from '../../components/Layouts/ListGroup';
import { userSelector } from '../../redux/selectors';

import './style.css';
import '../../../css/style.css';

const menu_item_admin = [...menu_item];
const menu_item_staff = [menu_item[0]];
export default function AdminLayout(props) {
  const { slot } = props;

  const [show, setShow] = React.useState(true);

  const user = useSelector(userSelector);

  return (
    <>
      <Header />
      <Drawer
        slot={
          <>
            <img src={Logo} alt="Logo" width="80" height="80" />
            <h5 className="font-weight-black text-danger pt-2">Online Assets Management</h5>
            <div className="py-5">
              {user?.type === 'Admin' && <ListGroup data={menu_item_admin} />}
              {user?.type === 'Staff' && <ListGroup data={menu_item_staff} />}
            </div>
          </>
        }
      />
      <main id="main" className="main p-5">
        {slot}
      </main>
      {user?.password_change_at === null && (
        <FirstLoginChangePassword show={show} setStateModal={() => false} closeModal={() => setShow(false)} />
      )}
    </>
  );
}

AdminLayout.propTypes = {
  slot: PropTypes.element.isRequired,
};
