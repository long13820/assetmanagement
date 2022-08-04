/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import { useEffect } from 'react';
import { Modal, Table } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';

import { assetAction } from '../../../redux/reducer/asset/asset.reducer';
import { assetAssignmentDetailSelector, assetDetailSelector } from '../../../redux/selectors/asset/asset.selector';

import './style.css';
export default function ShowDetailAsset(props) {
  const headerTableHistory = [
    {
      id: 1,
      name: 'Date',
      isSort: false,
    },
    {
      id: 2,
      name: 'Assigned to',
      isSort: false,
    },
    {
      id: 3,
      name: 'Assigned by',
      isSort: false,
    },
    {
      id: 4,
      name: 'Returned Date',
      isSort: false,
    },
  ];
  const dispatch = useDispatch();
  const checkAssetDetail = useSelector(assetDetailSelector);
  const detailAsset = checkAssetDetail != undefined && checkAssetDetail[0];
  const id = detailAsset != undefined ? detailAsset.id : '';
  const setStateModal = (value) => {
    if (value !== 'keep') {
      props.setStateModal();
    }
  };
  useEffect(() => {
    if (id == '') {
      return;
    }
    dispatch(
      assetAction.fetctDetailAssetAssignment({
        'filter[asset_id]': id,
      })
    );
  }, [id]);
  const listAssignments = useSelector(assetAssignmentDetailSelector);
  const renderTableBodyHistory = () => {
    if (!isEmpty(listAssignments)) {
      return listAssignments.map((item, index) => {
        return (
          <tr key={index + 1}>
            <td>{detailAsset != undefined && detailAsset.installed_date}</td>
            <td>{item.assigned_to}</td>
            <td>{item.assigned_by}</td>
            <td>{item.assigned_date}</td>
          </tr>
        );
      });
    } else {
      return (
        <tr>
          <td colSpan={4} className="text-danger text-center font-weight-bold p-3">
            There is not history !
          </td>
        </tr>
      );
    }
  };

  return (
    <>
      <Modal
        show={props.show}
        onHide={() => {
          setStateModal();
        }}
        dialogClassName="modal-90w"
        centered
        className="modal-dialog-centered-asset"
      >
        <Modal.Header closeButton className="w-100">
          <Modal.Title className="w-100">
            <h5 className=" d-flex text-danger font-weight-bold ">
              <p className="d-flex align-items-center w-100">
                <span className="flex-grow-1">Detailed Asset Information</span>
                <span onClick={() => setStateModal()} className="cursor-pointer">
                  <FaTimes />
                </span>
              </p>
            </h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-content-asset-detail">
            <table align="center" border="0" className="table table-bordered mb-0">
              <tbody>
                <tr>
                  <td width="40%" className="font-weight-bold ps-0">
                    Asset Code
                  </td>
                  <td width="60%" className="pe-0">
                    {detailAsset?.asset_code}
                  </td>
                </tr>
                <tr>
                  <td width="40%" className="font-weight-bold ps-0">
                    Asset Name
                  </td>
                  <td width="60%" className="pe-0">
                    {detailAsset?.asset_name}
                  </td>
                </tr>
                <tr>
                  <td width="40%" className="font-weight-bold ps-0">
                    Category
                  </td>
                  <td width="60%" className="pe-0">
                    {detailAsset?.category_name}
                  </td>
                </tr>
                <tr>
                  <td width="40%" className="font-weight-bold ps-0">
                    Installed Date
                  </td>
                  <td width="60%" className="pe-0">
                    {detailAsset?.installed_date}
                  </td>
                </tr>
                <tr>
                  <td width="40%" className="font-weight-bold ps-0">
                    State
                  </td>
                  <td width="60%" className="pe-0">
                    {detailAsset?.state}
                  </td>
                </tr>
                <tr>
                  <td width="40%" className="font-weight-bold ps-0">
                    Location
                  </td>
                  <td width="60%" className="pe-0">
                    <p>{detailAsset?.name}</p>
                  </td>
                </tr>
                <tr>
                  <td width="40%" className="font-weight-bold ps-0">
                    Specification
                  </td>
                  <td width="60%" className="pe-0">
                    <p className="word-break">{detailAsset?.specification}</p>
                  </td>
                </tr>
                <tr>
                  <td width="40%" className="font-weight-bold ps-0">
                    History
                  </td>
                  <td width="60%" />
                </tr>
              </tbody>
            </table>
            <Table bordered responsive>
              <thead>
                <tr>
                  {headerTableHistory.map((item) => (
                    <th key={item.id}>{item.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>{renderTableBodyHistory()}</tbody>
            </Table>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

ShowDetailAsset.propTypes = {
  show: PropTypes.bool.isRequired,
  setStateModal: PropTypes.func.isRequired,
};
