import { ListGroup } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import Notiflix from 'notiflix';
import PropTypes from 'prop-types';

import { assetDetailSelector, assetLoadingDetailSelector } from '../../../redux/selectors/asset/asset.selector';
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
  const body_sample_data = [
    {
      id: 1,
      name: 'Asset Code',
      isSort: false,
    },
    {
      id: 2,
      name: 'Asset Name',
      isSort: false,
    },
    {
      id: 3,
      name: 'Category',
      isSort: true,
    },
  ];
  const setStateModal = (value) => {
    if (value !== 'keep') {
      props.setStateModal();
    }
  };
  const renderTableBodyHistory = () => {
    return body_sample_data.map((item, index) => {
      return (
        <tr key={index + 1}>
          <td>{item.id}</td>
          <td>{item.name}</td>
          <td>{item.name}</td>
          <td>{item.name}</td>
        </tr>
      );
    });
  };

  const checkAssetDetail = useSelector(assetDetailSelector);
  const detailAsset = checkAssetDetail != undefined && checkAssetDetail[0];

  const assetLoadingDetail = useSelector(assetLoadingDetailSelector);
  assetLoadingDetail
    ? Notiflix.Loading.circle('Please wait...', {
        messageColor: '#d6001c',
        fontFamily: 'Mulish',
        svgColor: '#d6001c',
      })
    : Notiflix.Loading.remove();
  return (
    <Modal
      show={props.show}
      setStateModal={setStateModal}
      elementModalTitle={<p>Detailed Asset Information </p>}
      elementModalBody={
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
      }
    />
  );
}

ShowDetailAsset.propTypes = {
  show: PropTypes.bool.isRequired,
  setStateModal: PropTypes.func.isRequired,
};
