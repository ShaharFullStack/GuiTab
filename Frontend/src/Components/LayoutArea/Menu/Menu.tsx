import { NavLink } from "react-router-dom";
import "./Menu.css";

export function Menu(): JSX.Element {

    return (
        <div className="Menu">

            <NavLink to="/home" className="menu-link">Home</NavLink>

            <span> | </span>

            <NavLink to="/search" className="menu-link">Search</NavLink>

            <span> | </span>
            
            <NavLink to="/about" className="menu-link">About</NavLink>

        </div>
    );
}
