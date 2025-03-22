import React from 'react';
import TopMenu from './TopMenu';

import './Layout.scss';

const Layout = ({ children }) => {
  return (
    <div className='Layout'>
      <TopMenu />
      {children}
    </div>
  );
};

export default Layout;
