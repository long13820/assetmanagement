import React from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { editAssetById } from '../../../api/Asset/assetAPI';
import { editAssignmentById } from '../../../api/Assignment';
import { setSubTitle } from '../../../redux/reducer/app/app.reducer';
import { setAssetId, setIsEdit, setUserId } from '../../../redux/reducer/assignment/assignment.reducer';
import { ErrorToast, SuccessToast } from '../../Layouts/Alerts';
import { BlockUI } from '../../Layouts/Notiflix';

import DropdownListAsset from './DropdownListAsset';
import DropdownListUser from './DropdownListUser';

export default function AssignmentEditForm(props) {
  const dispatch = useDispatch();
  const assignment = useSelector((state) => state.assignment.assignment);
  const newUserId = useSelector((state) => state.assignment.userId);
  const newAssetId = useSelector((state) => state.assignment.assetId);
  const [note, setNote] = React.useState(assignment.note);

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
    if (newAssetId === 0) {
      const result = await editAssignmentById(assignment.id, stateFieldAssignment);
      if (result === 200) {
        props.backtoManageAssignment('updated_at', 'edit');
        dispatch(setIsEdit(false));
        dispatch(setSubTitle(''));
        SuccessToast('The assignment is editing successfully', 2000);
      } else {
        ErrorToast('Update assignment unsuccessfully', 2000);
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
        SuccessToast('The assignment is editing successfully', 2000);
      } else {
        ErrorToast('Update assignment unsuccessfully', 2000);
      }
    }
  };
  const handleBackToAssignment = () => {
    dispatch(setIsEdit(false));
    dispatch(setSubTitle(''));
    dispatch(setUserId(0));
    dispatch(setAssetId(0));
    setNote(assignment.note);
  };
  return (
    <div className="d-flex justify-content-center">
      <div className="backgroundCreate">
        <Form onSubmit={onSubmit}>
          <Form.Group className="mb-3">
            <Row>
              <Col md={3} xs={12}>
                <Form.Label className="font-weight-bold">User</Form.Label>
              </Col>
              <Col md={9} xs={12}>
                <DropdownListUser defaultValue={assignment.full_name} />
              </Col>
            </Row>
          </Form.Group>
          <Form.Group className="mb-3">
            <Row>
              <Col md={3} xs={12}>
                <Form.Label className="font-weight-bold">Asset</Form.Label>
              </Col>
              <Col md={9} xs={12}>
                <DropdownListAsset defaultValue={assignment.asset_name} />
              </Col>
            </Row>
          </Form.Group>
          <Form.Group className="mb-3">
            <Row>
              <Col md={3} xs={12}>
                <Form.Label className="font-weight-bold">Assigned Date</Form.Label>
              </Col>
              <Col md={9} xs={12}>
                <Form.Control type="date" disabled defaultValue={assignment.assigned_date} />
              </Col>
            </Row>
          </Form.Group>
          <Form.Group>
            <Row>
              <Col md={3} xs={12}>
                <Form.Label className="font-weight-bold">Note</Form.Label>
              </Col>
              <Col md={9} xs={12}>
                <Form.Control onChange={(e) => setNote(e.target.value)} value={note} as="textarea" />
              </Col>
            </Row>
          </Form.Group>

          <div className="d-flex justify-content-end mt-4">
            <Button
              disabled={
                (newAssetId === 0 && newUserId === 0 && note === assignment.note) ||
                (newAssetId === assignment.asset_id && newUserId === 0 && note === assignment.note) ||
                (newAssetId === 0 && newUserId === assignment.user_id && note === assignment.note) ||
                (newUserId === assignment.user_id && newAssetId === assignment.asset_id && note === assignment.note)
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
              onClick={handleBackToAssignment}
              className="font-weight-bold ms-3"
              variant="outline-secondary"
              type="cancel"
            >
              Cancel
            </Button>
          </div>
          <div className="mt-3 text-justify">
            <small>
              (*) If <span className="font-weight-bold">Asset name</span> is change, you can not select that{' '}
              <span className="font-weight-bold">Asset name</span> again. Refresh page or click on{' '}
              <span className="font-weight-bold">Cancel</span> button to turn back to{' '}
              <span className="font-weight-bold">Manage Assignment</span> page.
            </small>
          </div>
        </Form>
      </div>
    </div>
  );
}

AssignmentEditForm.protoTypes = {
  backtoManageAssignment: PropTypes.func,
};
