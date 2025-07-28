import React from "react";

function Sidebar(props) {
  const Contact = props?.Contact;
  return (
    <div>
      <div class="menu-container">
        <div class="collapse-icon">
          <span class="social_media_text"></span>
        </div>
        <div class="menu-item">
          <a
            href={Contact?.facebook}
            rel="noreferrer"
            target="_blank"
            style={{ padding: "0px" }}
          >
            <img src="assets/img/icons/f1.png" alt="" />
          </a>
        </div>
        <div class="menu-item">
          <a
            href={Contact?.instagram}
            rel="noreferrer"
            target="_blank"
            style={{ padding: "0px" }}
          >
            <img
              src="assets/img/icons/in.png"
              style={{ height: "35px" }}
              alt=""
            />
          </a>
        </div>
        <div class="menu-item">
          <a
            href={Contact?.youtube}
            rel="noreferrer"
            target="_blank"
            style={{ padding: "0px" }}
          >
            <img src="assets/img/icons/y1.png" alt="" />
          </a>
        </div>
        <div class="menu-item">
          <a
            href={Contact?.twitter}
            rel="noreferrer"
            target="_blank"
            style={{ padding: "0px" }}
          >
            <img src="assets/img/icons/t1.png" alt="" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
