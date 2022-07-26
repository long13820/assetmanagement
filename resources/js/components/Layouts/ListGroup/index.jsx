import { ListGroup as ListGroupBootstrap } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import './style.css';

export default function ListGroup(props) {
  const { data } = props;

  return (
    <ListGroupBootstrap id="list-group" as="ul">
      {data.map((element) => (
        <NavLink
          to={element.link}
          key={element.id}
          className={({ isActive }) => (isActive ? 'app-active-link' : ' app-not-active-link')}
        >
          <ListGroupBootstrap.Item className="py-3 d-flex align-items-center" as="li">
            <h5>{element.icon}</h5>
            <h5 className="font-weight-bold ms-3">{element.name}</h5>
          </ListGroupBootstrap.Item>
        </NavLink>
      ))}
    </ListGroupBootstrap>
  );
}

ListGroup.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      active: PropTypes.bool.isRequired,
    })
  ),
};
