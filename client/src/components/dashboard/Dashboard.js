import React, { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profile';
import DashboardActions from'./DashboardActions';
import Experience from'./Experience';
import Education from './Education';
import { deleteAccount } from '../../actions/profile';

// import spinner from '../layout/spinner'

const Dashboard = ({ deleteAccount, getCurrentProfile, auth : { user }, profile : {profile, loading} }) => {
    
    useEffect(() => {
       getCurrentProfile();
    }, [getCurrentProfile])
;

    return loading && profile === null ? 'Loading...' :
    <Fragment>
        <h1 className = "large text-primary">Dashboard</h1>
        <p className = "lead">
            <i className = "fas fa-user"></i>{' '}
            Welcome, { user && user.name }
        </p>
        {profile !== null ? (
            <Fragment>
                <DashboardActions />
                <Experience experience = { profile.experience }/>
                <Education education = { profile.education } />
                <div className = "my-2">
                    <button className = "btn btn-danger" onClick= {() => deleteAccount()}>
                      <i className = "fas fa-user"></i>{' '}{' '}Delete My Account  
                    </button>
                </div>
            </Fragment>
        ) : (
            <Fragment>
                <p>You have not yet set up a Profile, Please Add Some Info.</p>
                <Link to = "/create-profile" className = 'btn btn-primary my-1'>
                    Create Profile
                </Link>
            </Fragment>
        )}
    </Fragment>
}

Dashboard.propTypes = {
    getCurrentProfile : PropTypes.func.isRequired,
    auth : PropTypes.object.isRequired,
    profile : PropTypes.object.isRequired,
    deleteAccount : PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
    auth : state.auth,
    profile : state.profile,
})

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(Dashboard);
