import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Notiflix from 'notiflix';
import PropTypes from 'prop-types';

import { editAssetById } from '../../../api/Asset/assetAPI';
import { editAssignmentById } from '../../../api/Assignment';
import { setExpiredToken, setSubTitle } from '../../../redux/reducer/app/app.reducer';
import {
  setAssetId,
  setIsEdit,
  setIsFocusAsset,
  setIsFocusUser,
  setUserId,
} from '../../../redux/reducer/assignment/assignment.reducer';
import { ErrorToast, SuccessToast } from '../../Layouts/Alerts';
import Notification from '../../Layouts/Notification';
import { BlockUI } from '../../Layouts/Notiflix';

import DropdownListAsset from './DropdownListAsset';
import DropdownListUser from './DropdownListUser';

export default function AssignmentEditForm(props) {
  const dispatch = useDispatch();
  const assignment = useSelector((state) => state.assignment.assignment);
  const isSearching = useSelector((state) => state.assignment.isSearching);
  const isSearchingAsset = useSelector((state) => state.assignment.isSearchingAsset);
  const newUserId = useSelector((state) => state.assignment.userId);
  const newAssetId = useSelector((state) => state.assignment.assetId);
  const [note, setNote] = React.useState(assignment.note);
  const [showNotification, setShowNotifcation] = React.useState(false);

  const onSubmit = async (e, data) => {
    e.preventDefault();
    BlockUI('#root', 'fixed');
    const stateFieldOldAsset = { state: 'Available' };
    const stateFieldNewAsset = { state: 'Assigned' };

    const stateFieldAssignment = {
      ...data,
      note: note,
      asset_id: newAssetId === 0 ? assignment.asset_id : newAssetId,
      user_id: newUserId === 0 ? assignment.user_id : newUserId,
    };
    if (newAssetId === 0 || newAssetId === assignment.asset_id) {
      const result = await editAssignmentById(assignment.id, stateFieldAssignment);
      if (result === 200) {
        props.backtoManageAssignment('updated_at', 'edit');
        dispatch(setIsEdit(false));
        dispatch(setSubTitle(''));
        dispatch(setUserId(0));
        dispatch(setAssetId(0));
        dispatch(setIsFocusAsset(false));
        dispatch(setIsFocusUser(false));
        SuccessToast('The assignment is edited successfully', 2000);
      } else if (result === 401) {
        dispatch(setExpiredToken(true));
        localStorage.removeItem('token');
        Notiflix.Block.remove('#root');
      } else {
        ErrorToast('Updated assignment unsuccessfully', 2000);
        Notiflix.Block.remove('#root');
      }
    }
    if (newAssetId !== 0) {
      const result = await editAssignmentById(assignment.id, stateFieldAssignment);
      const resultUpdateOldAsset = await editAssetById(assignment.asset_id, stateFieldOldAsset);
      const resultUpdateNewAsset = await editAssetById(newAssetId, stateFieldNewAsset);

      if (result === 200 && resultUpdateOldAsset === 200 && resultUpdateNewAsset === 200) {
        props.backtoManageAssignment('updated_at', 'edit');
        dispatch(setIsEdit(false));
        dispatch(setSubTitle(''));
        dispatch(setUserId(0));
        dispatch(setAssetId(0));
        dispatch(setIsFocusAsset(false));
        dispatch(setIsFocusUser(false));
        SuccessToast('The assignment is edited successfully', 2000);
      } else if (result === 401 || resultUpdateNewAsset === 401 || resultUpdateOldAsset === 401) {
        dispatch(setExpiredToken(true));
        localStorage.removeItem('token');
        Notiflix.Block.remove('#root');
      } else {
        ErrorToast('Updated assignment unsuccessfully', 2000);
        Notiflix.Block.remove('#root');
      }
    }
  };
  const handleBackToAssignment = () => {
    setShowNotifcation(false);
    dispatch(setIsEdit(false));
    dispatch(setSubTitle(''));
    dispatch(setUserId(0));
    dispatch(setAssetId(0));
    setNote(assignment.note);
    dispatch(setIsFocusAsset(false));
    dispatch(setIsFocusUser(false));
  };
  const handleEditNote = (e) => {
    e.preventDefault();
    setNote(e.target.value);
    dispatch(setIsFocusAsset(false));
    dispatch(setIsFocusUser(false));
  };
  return (
    <div className="d-flex justify-content-center">
      <div className="backgroundCreate">
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Row>
              <Col md={3} xs={12}>
                <Form.Label className="font-weight-bold pt-2">User</Form.Label>
              </Col>
              <Col md={9} xs={12}>
                <DropdownListUser defaultValue={assignment.full_name} />
              </Col>
            </Row>
          </Form.Group>
          <Form.Group className="mb-3">
            <Row>
              <Col md={3} xs={12}>
                <Form.Label className="font-weight-bold pt-2">Asset</Form.Label>
              </Col>
              <Col md={9} xs={12}>
                <DropdownListAsset defaultValue={assignment.asset_name} />
              </Col>
            </Row>
          </Form.Group>
          <Form.Group className="mb-3">
            <Row>
              <Col md={3} xs={12}>
                <Form.Label className="font-weight-bold pt-2">Assigned Date</Form.Label>
              </Col>
              <Col md={9} xs={12}>
                <Form.Control type="date" disabled defaultValue={assignment.assigned_date} />
              </Col>
            </Row>
          </Form.Group>
          <Form.Group>
            <Row>
              <Col md={3} xs={12}>
                <Form.Label className="font-weight-bold pt-2">Note</Form.Label>
              </Col>
              <Col md={9} xs={12}>
                <Form.Control onChange={handleEditNote} maxLength={200} value={note} as="textarea" />
                <div className="d-flex justify-content-end font-weight-bold">
                  <small>{note !== null ? note.length : 0}/200</small>
                </div>
              </Col>
            </Row>
          </Form.Group>

          <div className="d-flex justify-content-end mt-4">
            <Button
              id="save-edit-btn"
              disabled={
                (newAssetId === 0 && newUserId === 0 && note === assignment.note) ||
                (newAssetId === assignment.asset_id && newUserId === 0 && note === assignment.note) ||
                (newAssetId === 0 && newUserId === assignment.user_id && note === assignment.note) ||
                (newUserId === assignment.user_id && newAssetId === assignment.asset_id && note === assignment.note) ||
                isSearching ||
                isSearchingAsset
                  ? true
                  : false
              }
              className="font-weight-bold"
              variant="danger"
              type="submit"
            >
              Save
            </Button>
            <Button
              id="cancel-edit-btn"
              onClick={() => setShowNotifcation(true)}
              className="font-weight-bold ms-3"
              variant="outline-secondary"
            >
              Cancel
            </Button>
          </div>
        </Form>
        <Notification
          show={showNotification}
          backToView={() => handleBackToAssignment()}
          setStateModal={() => setShowNotifcation(false)}
        />
      </div>
    </div>
  );
}

AssignmentEditForm.propTypes = {
  backtoManageAssignment: PropTypes.func,
};
