import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Backdrop from "../UIElements/Backdrop/Backdrop";
import MainHeader from "./MainHeader";

import "./MainNavigation.css";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";

const MainNavigation = (props) => {
  const [showSideDrawer, setShowSideDrawer] = useState(false);

  const openDrawerHandler = (event) => {
    setShowSideDrawer(true);
  };

  const closeDrawerHandler = (event) => {
    setShowSideDrawer(false);
  };

  return (
    <>
      {showSideDrawer && <Backdrop onClick={closeDrawerHandler}/>}
      (<SideDrawer show={showSideDrawer} closeDrawer={closeDrawerHandler}>
          <nav className="main-navigation__drawer-nav">
            <NavLinks />
          </nav>
        </SideDrawer>)
      <MainHeader>
        <button
          className="main-navigation__menu-btn"
          onClick={openDrawerHandler}
        >
          <span />
          <span />
          <span />
        </button>
        <div className="main-navigation__title">
          <Link to="/">Your Places</Link>
        </div>
        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </>
  );
};

export default MainNavigation;
