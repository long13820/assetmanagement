/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import { useEffect } from 'react';
import { ListGroup } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';

import { assetAction } from '../../../redux/reducer/asset/asset.reducer';
import {
  assetAssignmentDetailSelector,
  assetDetailSelector,
  assetLoadingDetailSelector,
} from '../../../redux/selectors/asset/asset.selector';
import Modal from '../../Layouts/Modal';
import Table from '../../Layouts/Table';

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
  const assetloadingDetailSelector = useSelector(assetLoadingDetailSelector);
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
            <td>{detailAsset != undefined && detailAsset.asset_name}</td>
            <td>{item.assigned_to}</td>
            <td>{item.assigned_by}</td>
            <td>{item.assigned_date}</td>
          </tr>
        );
      });
    } else {
      return (
        <tr>
          <td colSpan={4} className="text-danger text-center font-weight-bold">
            There is not history !
          </td>
        </tr>
      );
    }
  };

  return (
    !assetloadingDetailSelector && (
      <Modal
        show={props.show}
        setStateModal={setStateModal}
        elementModalTitle={
          <p className="d-flex align-items-center w-100">
            <span className="flex-grow-1">Detailed Asset Information</span>
            <span onClick={() => setStateModal()} className="cursor-pointer">
              <FaTimes />
            </span>
          </p>
        }
        elementModalBody={
          <>
            <div className="modal-content-asset-detail">
              <ListGroup className="list-group-item-detail">
                <ListGroup.Item className="show-assset-list-detail">
                  <div className="show-assset-list-detail-item">Asset Code</div>
                  <div>{detailAsset != undefined && detailAsset.asset_code}</div>
                </ListGroup.Item>
              </ListGroup>
              <ListGroup className="list-group-item-detail">
                <ListGroup.Item className="show-assset-list-detail">
                  <div className="show-assset-list-detail-item">Asset Name</div>
                  <div>{detailAsset != undefined && detailAsset.asset_name}</div>
                </ListGroup.Item>
              </ListGroup>
              <ListGroup className="list-group-item-detail">
                <ListGroup.Item className="show-assset-list-detail">
                  <div className="show-assset-list-detail-item">Category</div>
                  <div>{detailAsset != undefined && detailAsset.category_name}</div>
                </ListGroup.Item>
              </ListGroup>
              <ListGroup className="list-group-item-detail">
                <ListGroup.Item className="show-assset-list-detail">
                  <div className="show-assset-list-detail-item">Installed Date</div>
                  <div>{detailAsset != undefined && detailAsset.installed_date}</div>
                </ListGroup.Item>
              </ListGroup>
              <ListGroup className="list-group-item-detail">
                <ListGroup.Item className="show-assset-list-detail">
                  <div className="show-assset-list-detail-item">State</div>
                  <div>{detailAsset != undefined && detailAsset.state}</div>
                </ListGroup.Item>
              </ListGroup>
              <ListGroup className="list-group-item-detail">
                <ListGroup.Item className="show-assset-list-detail">
                  <div className="show-assset-list-detail-item">Location</div>
                  <div>{detailAsset != undefined && detailAsset.name}</div>
                </ListGroup.Item>
              </ListGroup>
              <ListGroup className="list-group-item-detail">
                <ListGroup.Item className="show-assset-list-detail">
                  <div className="show-assset-list-detail-item">Specification</div>
                  <div>{detailAsset != undefined && detailAsset.specification}</div>
                </ListGroup.Item>
              </ListGroup>
              <ListGroup className="list-group-item-detail">
                <ListGroup.Item className="">
                  <div className="show-assset-list-detail-item">History</div>
                  <div>
                    <Table tableHeader={headerTableHistory} tableBody={renderTableBodyHistory()} />
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </div>
          </>
        }
      />
    )
  );
}

ShowDetailAsset.propTypes = {
  show: PropTypes.bool.isRequired,
  setStateModal: PropTypes.func.isRequired,
};
