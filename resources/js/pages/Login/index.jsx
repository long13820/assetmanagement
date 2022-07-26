import React from 'react';

import Logo from '../../../assets/images/logo.png';
import FormLogin from '../../components/Login/FormLogin';

import './style.css';

export default function Login() {
  return (
    <section className="section-login">
      <div className="sl-box">
        <img src={Logo} alt="Logo" width="80" height="80" />
        <h5 className="font-weight-black text-danger mt-2">Online Assets Management</h5>
        <h4 className="mt-2 font-weight-bold">Welcome back</h4>
        <h6 className="mt-2">
          Login to your&nbsp;<span className="font-weight-bold">account</span>
        </h6>
        <div className="mt-4">
          <FormLogin />
        </div>
      </div>
    </section>
  );
}
