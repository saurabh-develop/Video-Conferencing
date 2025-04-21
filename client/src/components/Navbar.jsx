import React from "react";
import styles from "./styles/Navbar.module.css";
const Navbar = () => {
  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <ul>
          <li>Home</li>
          <li>About</li>
          <li>Contact Us</li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
