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

import ShowCustomer from '../page/CustomerPage/ShowCustomer';

import ShowMenu from '../page/MenuPage/ShowMenu';
import AddMenu from '../page/MenuPage/AddMenu';
import EditMenu from '../page/MenuPage/EditMenu';

import ShowBahan from '../page/BahanPage/ShowBahan';

import RiwayatBahanMasuk from '../page/HistoryPage/RiwayatMasuk';
import RiwayatBahanKeluar from '../page/HistoryPage/RiwayatKeluar';

import ShowReservasiLangsung from '../page/ReservasiPage/ShowReservasiLangsung';
import ShowReservasiTakLangsung from '../page/ReservasiPage/ShowReservasiTakLangsung';
import ReservasiLangsung from '../page/ReservasiPage/ReservasiLangsung';
import EditReservasiLangsung from '../page/ReservasiPage/EditReservasiLangsung';
import EditReservasiTakLangsung from '../page/ReservasiPage/EditReservasiTakLangsung';
import ReservasiTakLangsung from '../page/ReservasiPage/ReservasiTakLangsung';

import DaftarPesananAll from '../page/DaftarPesanan/DaftarPesananAll';
import DaftarPesananChef from '../page/DaftarPesanan/DaftarPesananChef';
import DaftarPesananWaiter from '../page/DaftarPesanan/DaftarPesananWaiter';

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
    } else if (
      user.jabatan === 'Owner' ||
      user.jabatan === 'Operational Manager'
    ) {
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

  const OMWaiterChefRoute = ({ ...props }) => {
    if (!user) {
      return <Redirect to='/login' />;
    } else if (
      user.jabatan === 'Operational Manager' ||
      user.jabatan === 'Waiter' ||
      user.jabatan === 'Chef'
    ) {
      return <Route {...props} />;
    } else {
      return <Redirect to='/' />;
    }
  };

  const OMWaiterCashierRoute = ({ ...props }) => {
    if (!user) {
      return <Redirect to='/login' />;
    } else if (
      user.jabatan === 'Operational Manager' ||
      user.jabatan === 'Waiter' ||
      user.jabatan === 'Cashier'
    ) {
      return <Route {...props} />;
    } else {
      return <Redirect to='/' />;
    }
  };

  const ChefRoute = ({ ...props }) => {
    if (!user) {
      return <Redirect to='/login' />;
    } else if (user.jabatan === 'Chef') {
      return <Route {...props} />;
    } else {
      return <Redirect to='/' />;
    }
  };

  const WaiterRoute = ({ ...props }) => {
    if (!user) {
      return <Redirect to='/login' />;
    } else if (user.jabatan === 'Waiter') {
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

      <OMRoute exact path='/showMenu' component={ShowMenu} />
      <OMRoute exact path='/addMenu' component={AddMenu} />
      <OMRoute exact path='/editMenu/:userId' component={EditMenu} />

      <OMChefRoute exact path='/showBahan' component={ShowBahan} />
      <OMWaiterChefRoute exact path='/showCustomer' component={ShowCustomer} />

      <OMChefRoute exact path='/riwmas' component={RiwayatBahanMasuk} />
      <OMChefRoute exact path='/riwkel' component={RiwayatBahanKeluar} />

      <OMWaiterCashierRoute
        exact
        path='/showReservasiLangsung'
        component={ShowReservasiLangsung}
      />
      <OMWaiterCashierRoute
        exact
        path='/showReservasiTakLangsung'
        component={ShowReservasiTakLangsung}
      />
      <OMWaiterCashierRoute
        exact
        path='/showReservasiLangsung/reservasiLangsung'
        component={ReservasiLangsung}
      />
      <OMWaiterCashierRoute
        exact
        path='/showReservasiLangsung/EditReservasiLangsung/:userId'
        component={EditReservasiLangsung}
      />
      <OMWaiterCashierRoute
        exact
        path='/showReservasiTakLangsung/EditReservasiTakLangsung/:userId'
        component={EditReservasiTakLangsung}
      />
      <OMWaiterCashierRoute
        exact
        path='/showReservasiTakLangsung/reservasiTakLangsung'
        component={ReservasiTakLangsung}
      />

      <ChefRoute exact path='/pesananChef' component={DaftarPesananChef} />
      <WaiterRoute
        exact
        path='/pesananWaiter'
        component={DaftarPesananWaiter}
      />
      <OMRoute exact path='/daftarPesanan' component={DaftarPesananAll} />
    </Switch>
  );
};

export default ContentCustom;
