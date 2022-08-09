/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useEffect, useState } from 'react';
import { Container, Navbar, NavDropdown } from 'react-bootstrap';
import { FaAngleRight } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { setSubTitle } from '../../../redux/reducer/app/app.reducer';
import { assetAction } from '../../../redux/reducer/asset/asset.reducer';
import {
  setIsAdd as setIsAddAssignment,
  setKey as setKeyAssignment,
} from '../../../redux/reducer/assignment/assignment.reducer';
import { setHomeKey } from '../../../redux/reducer/home/home.reducer';
import { setRequestKey } from '../../../redux/reducer/request/request.reducer';
import { setIsAdd, setIsEdit, setKey } from '../../../redux/reducer/user/user.reducer';
import {
  keyAssignmentSelector,
  keyHomeSelector,
  keyRequestSelector,
  keyUserSelector,
  subTitleSelector,
  titleSelector,
  userSelector,
} from '../../../redux/selectors';
import ChangePassword from '../../Auth/ChangePassword';
import Logout from '../../Auth/Logout';

import './style.css';

export default function Header() {
  const user = useSelector(userSelector);
  const title = useSelector(titleSelector);
  const subTitle = useSelector(subTitleSelector);
  const keyUser = useSelector(keyUserSelector);
  const keyHome = useSelector(keyHomeSelector);
  const keyRequest = useSelector(keyRequestSelector);
  const keyAsset = useSelector((state) => state.asset.key);
  const keyAssignment = useSelector(keyAssignmentSelector);

  const dispatch = useDispatch();

  const [showChangePassword, setStateModal] = useState(false);
  const [showLogout, setStateModalLogout] = useState(false);

  const location = useLocation();
  const urlPageAsset = location.pathname === '/manage_asset' ? true : false;

  useEffect(() => {
    if (!urlPageAsset) {
      dispatch(
        assetAction.setFilter({
          'filter[state]': 'Available,Not Available,Assigned',
          'filter[category]': undefined,
          'sort[asset_code]': 'asc',
          'sort[asset_name]': undefined,
          'sort[category_name]': undefined,
          'sort[state]': undefined,
          'sort[updated_at]': undefined,
        })
      );
      dispatch(assetAction.setSortHeader(true));
      dispatch(assetAction.setIsEdit(false));
      dispatch(assetAction.setIsAdd(false));
    }
  }, [dispatch, urlPageAsset]);

  const forceReload = (title) => {
    dispatch(setSubTitle(''));
    if (title === 'Manage User') {
      dispatch(setIsAdd(false));
      dispatch(setIsEdit(false));
      dispatch(setKey(keyUser + 1));
    }
    if (title === 'Manage Asset') {
      dispatch(assetAction.setIsAdd(false));
      dispatch(assetAction.setIsEdit(false));
      dispatch(assetAction.setKey(keyAsset + 1));
      dispatch(
        assetAction.setFilter({
          'filter[state]': 'Available,Not Available,Assigned',
          'filter[category]': undefined,
        })
      );
    }
    if (title === 'Manage Assignment') {
      dispatch(setIsAddAssignment(false));
      dispatch(setKeyAssignment(keyAssignment + 1));
      dispatch(
        assetAction.setFilter({
          'filter[state]': 'Available,Not Available,Assigned',
          'filter[category]': undefined,
          'sort[asset_code]': 'asc',
          'sort[asset_name]': undefined,
          'sort[category_name]': undefined,
          'sort[state]': undefined,
          'sort[updated_at]': undefined,
        })
      );
      dispatch(assetAction.setSortHeader(true));
    }
    if (title === 'Home') {
      dispatch(setHomeKey(keyHome + 1));
    }
    if (title === 'Request for Returning') {
      dispatch(setRequestKey(keyRequest + 1));
    }
  };

  return (
    <Navbar className="header" fixed="top" bg="danger">
      <Container fluid>
        <Navbar.Brand className="text-white d-flex align-items-center font-weight-bold">
          <span onClick={() => forceReload(title)} className="cursor-pointer">
            {title}
          </span>
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
