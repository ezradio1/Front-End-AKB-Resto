import React, { useState, createContext } from 'react';

export const UserContext = createContext();

export const UserProvider = (props) => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const iniateUser = currentUser ? currentUser : null;
  const [user, setUser] = useState(iniateUser);
  // const [idEdit, setidEdit] = useState('mantap');
  const [visible, setVisible] = useState(false);
  // const visible = 'lalaa';

  return (
    <UserContext.Provider value={[user, setUser, visible, setVisible]}>
      {props.children}
    </UserContext.Provider>
  );
};
