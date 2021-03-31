import React, { Component, useContext, useEffect } from 'react';
import { Layout } from 'antd';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';

import { UserContext } from '../context/UserContext';

import Home from '../page/HomePage/Home';

import Login from '../page/LoginPage/Login';
import ChangePassword from '../page/LoginPage/ChangePassword';

import ShowEmployee from '../page/EmployeePage/ShowEmployee';
import AddEmployee from '../page/EmployeePage/AddEmployee';
import EditEmployee from '../page/EmployeePage/EditEmployee';

import ShowTable from '../page/TablePage/ShowTable';
import AddTable from '../page/TablePage/AddTable';

import ShowMenu from '../page/MenuPage/ShowMenu';
import AddMenu from '../page/MenuPage/AddMenu';
import EditMenu from '../page/MenuPage/EditMenu';

import ShowBahan from '../page/BahanPage/ShowBahan';
import AddBahan from '../page/BahanPage/AddBahan';

const { Content } = Layout;

const ContentCustom = () => {
  const [user, setUser] = useContext(UserContext);

  useEffect(() => {
    console.log('Content : ' + user);
  });

  const AuthRoute = ({ ...props }) => {
    if (user) {
      return <Redirect to='/' />;
    } else {
      return <Route {...props} />;
    }
  };

  const PrivateRoute = ({ ...props }) => {
    if (!user) {
      return <Redirect to='/login' />;
    } else {
      return <Route {...props} />;
    }
  };

  const OMRoute = ({ ...props }) => {
    if (!user) {
      return <Redirect to='/login' />;
    } else if (user.jabatan === 'Operational Manager') {
      return <Route {...props} />;
    } else {
      return <Redirect to='/' />;
    }
  };

  const EmployeeRoute = ({ ...props }) => {
    if (!user) {
      return <Redirect to='/login' />;
    } else if (user.jabatan === 'Owner') {
      return <Route {...props} />;
    } else {
      return <Redirect to='/' />;
    }
  };

  const OMChefRoute = ({ ...props }) => {
    if (!user) {
      return <Redirect to='/login' />;
    } else if (
      user.jabatan === 'Operational Manager' ||
      user.jabatan === 'Chef'
    ) {
      return <Route {...props} />;
    } else {
      return <Redirect to='/' />;
    }
  };

  return (
    <Switch>
      <PrivateRoute exact path='/' component={Home} />

      <AuthRoute exact path='/login' component={Login} />
      <PrivateRoute exact path='/changePass' component={ChangePassword} />

      <EmployeeRoute exact path='/showEmployee' component={ShowEmployee} />
      <EmployeeRoute exact path='/addEmployee' component={AddEmployee} />
      <EmployeeRoute
        exact
        path='/editEmployee/:userId'
        component={EditEmployee}
      />

      <OMRoute exact path='/showTable' component={ShowTable} />
      <OMRoute exact path='/addTable' component={AddTable} />

      <OMRoute exact path='/showMenu' component={ShowMenu} />
      <OMRoute exact path='/addMenu' component={AddMenu} />
      <OMRoute exact path='/editMenu/:userId' component={EditMenu} />

      <OMChefRoute exact path='/showBahan' component={ShowBahan} />
      <OMChefRoute exact path='/addBahan' component={AddBahan} />
    </Switch>
  );
};

export default ContentCustom;
