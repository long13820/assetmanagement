import { useState } from 'react';
import { Container, Navbar, NavDropdown } from 'react-bootstrap';
import { FaAngleRight } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import { subTitleSelector, titleSelector, userSelector } from '../../../redux/selectors';
import ChangePassword from '../../Auth/ChangePassword';
import Logout from '../../Auth/Logout';

import './style.css';

export default function Header() {
  const user = useSelector(userSelector);
  const title = useSelector(titleSelector);
  const subTitle = useSelector(subTitleSelector);

  const [showChangePassword, setStateModal] = useState(false);
  const [showLogout, setStateModalLogout] = useState(false);

  return (
    <Navbar className="header" fixed="top" bg="danger">
      <Container fluid>
        <Navbar.Brand className="text-white d-flex align-items-center font-weight-bold">
          <span>{title}</span>
          {subTitle !== '' && (
            <>
              <FaAngleRight className="mx-2" />
              <span>{subTitle}</span>
            </>
          )}
        </Navbar.Brand>
        {Object.keys(user).length > 0 && (
          <NavDropdown title={user.full_name} className="justify-content-end text-white" id="nav-user-dropdown">
            <NavDropdown.Item className="font-weight-medium" onClick={() => setStateModal(true)}>
              Change Password
            </NavDropdown.Item>
            <NavDropdown.Item className="font-weight-medium" onClick={() => setStateModalLogout(true)}>
              Logout
            </NavDropdown.Item>
          </NavDropdown>
        )}
        <ChangePassword show={showChangePassword} setStateModal={() => setStateModal(false)} />
        <Logout show={showLogout} setStateModal={() => setStateModalLogout(false)} />
      </Container>
    </Navbar>
  );
}
