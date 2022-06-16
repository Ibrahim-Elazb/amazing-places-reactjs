import { useContext } from "react";
import { NavLink, useHistory } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import Button from "../FormElements/Button/Button";

import "./NavLinks.css";
const NavLinks = (props) => {
  const loginContext = useContext(AuthContext);
  const history = useHistory();

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact activeClassName="active">
          All Users
        </NavLink>
      </li>
      {loginContext.isLogin && (
        <li>
          <NavLink to={`/${loginContext.id}/places`} activeClassName="active">
            My Places
          </NavLink>
        </li>
      )}
      {loginContext.isLogin && (
        <li>
          <NavLink to="/places/new" activeClassName="active">
            Add New Place
          </NavLink>
        </li>
      )}
      {!loginContext.isLogin && (
        <li>
          <NavLink to="/auth" activeClassName="active">
            Authenticate
          </NavLink>
        </li>
      )}
      {loginContext.isLogin && (
        <li>
          <Button
            type="button"
            onClick={() => {
              loginContext.logOutHandler();
              history.push(`/`);
            }}
          >
            LogOut
          </Button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
