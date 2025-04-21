import React from "react";
import styles from "./styles/LandingPage.module.css";

const LandingPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.heading}>Introduction</div>
      <div className={styles.body}>
        Welcome to our interactive virtual space! Once you sign up, you’ll
        create your own avatar, which represents you in the space. There are two
        user roles: Admin and User. <br />
        Admins can create new spaces and get a unique invitation link. Users can
        join any space by clicking the invite link shared by the admin. Inside
        each space, there are three rooms, and you can move your avatar between
        them just by clicking or dragging it to the desired room. <br />
        Room 1 – Chat Room: Engage in real-time text conversations with everyone
        inside this room. <br />
        Room 2 – Audio Room: Talk with other users through voice chat. It’s
        perfect for quick discussions or hangouts. <br />
        Room 3 – Video + Chat Room: Turn on your camera and mic to video chat
        while also typing in a side chat panel.
        <br />
        Your avatar moves freely, making the whole experience feel alive and
        social. Whether you're there to chat, collaborate, or hang out, this app
        brings people together in a unique and dynamic way. Just log in, move
        your avatar, and start connecting!
      </div>
      <div className={styles.fadingLine}></div>
      <footer className={styles.footer}>
        <ul>
          <li>About</li>
          <li>Support Us</li>
          <li>Found Bug</li>
          <li>Report</li>
        </ul>
      </footer>
    </div>
  );
};

export default LandingPage;
