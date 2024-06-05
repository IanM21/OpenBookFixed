import React from 'react';

import styles from '../../styles/dashboard.module.css';
import Navbar from '../common/navbar';
import Sidebar from '../Sidebar2';

// import Footer from "../ui/dashboard/footer/footer"

const Layout = ({
    children,
  }: {
    children: React.ReactNode;
  }) => {
  return (
    <div className={styles.container}>
      <div className={styles.menu}>
        <Sidebar/>
      </div>
      <div className={styles.content}>
        <Navbar/>
        {children}
        {/* <Footer/> */}
      </div>
    </div>
  )
}

export default Layout;