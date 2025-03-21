import React from 'react';
import TopMenu from './TopMenu';

import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="Layout">
      <TopMenu />
      {children}
    </div>
  );
};

export default Layout;