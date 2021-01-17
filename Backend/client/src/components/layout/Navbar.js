import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'
import { logout } from '../../actions/auth';

const navbar = ({ logout, auth : { isAuthenticated, loading } }) => {
  
  const authLinks = (
    <ul>
      <li>
        <Link to = "/profiles">
          Developers
        </Link>
      </li>
      <li>
        <Link to = "/posts">
          Posts
        </Link>
      </li>
      <li>
        <Link to = "/dashboard">
          <i className = 'fas fa-user' /> {' '}
          <span className = 'hide-sm'>DashBoard</span>
        </Link>
      </li>
      <li>
        <a onClick = { logout } href = '#!'>
            <i className = "fas fa-sign-out-alt"></i>{' '}
            <span className = "hide-sm">Log Out</span>
        </a>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
        <li>
          <Link to = "/profiles">
            Developers
          </Link>
        </li>
        <li><Link to = "/register">Register</Link></li>
        <li><Link to = "/login">Login</Link></li>
    </ul>
  );
  
  return (
        <nav className = "navbar bg-dark">
      <h1>
        <Link to="/"><i className = "fas fa-code"></i> DevConnector</Link>
      </h1>
      { !loading ? (<Fragment>{ isAuthenticated ? authLinks : guestLinks }</Fragment>) : null}
    </nav>
    )
}

navbar.propTypes = {
  logout : PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth : state.auth
});

export default connect(mapStateToProps, { logout })(navbar);