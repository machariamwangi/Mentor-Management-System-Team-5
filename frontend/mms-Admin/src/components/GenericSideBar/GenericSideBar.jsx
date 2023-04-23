import React, { useState, useEffect, useRef } from "react";
import cx from "classnames";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import styles from "./GenericSideBar.module.scss";
// import { ReactComponent as SettingsToggler } from "@/assets/icons/settings-toggler-icon.svg";
import searchIcon from "@/assets/icons/settings-toggler-icon.svg";
import useIsMobile from "@/hooks/useIsMobile";

function GenericSideBar({ data, selectedMenuItem, activeMenuItemClass }) {
  const params = useParams();
  const [activeLink, setActiveLink] = useState("");
  const isMobile = useIsMobile();

  const [open, setOpen] = useState(false);
  const [currentSideBarPosition, setCurrentSideBarPosition] = useState(0);
  const currentId = params?.id;

  const sidebarRef = useRef(null);

  const handleSidebarToggle = () => {
    setOpen(!open);
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    const active = data.listItems.find((menuItem) => menuItem.id.toString() === currentId);
    setActiveLink(active ? active.id : "");
  }, [currentId, data]);

  useEffect(() => {
    const currentHeight = sidebarRef.current.getBoundingClientRect();
    setCurrentSideBarPosition(currentHeight.top);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile && open) {
      document.body.style.overflow = "hidden";
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.body.style.overflow = "auto";
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, open]);

  const sidebarWidth = isMobile ? (open ? "100%" : "50px") : "250px";
  const sidebarHeight = open ? "100%" : "100%";

  const handleMenuClick = (itemId) => {
    if (isMobile && open) {
      selectedMenuItem(itemId);
      setOpen(false);
    } else if (isMobile && !open) {
      setOpen(true);
    } else {
      selectedMenuItem(itemId);
    }
  };

  return (
    <div
      ref={sidebarRef}
      className={cx(styles.genericSideBarContainer, "flexCol")}
      style={{
        width: sidebarWidth,
        height: sidebarHeight,
        position: open ? "fixed" : "relative",
        top: open ? currentSideBarPosition : "0",
        transition: "width 0s",
        overflowX: isMobile && !open ? "hidden" : "auto",
        whiteSpace: open ? "normal" : "nowrap"
      }}
    >
       <div className={cx(styles.selectionSideBarHeader, "flexCol")}>{data?.headerComponent}</div>
      {/* {isMobile && <SettingsToggler onClick={handleSidebarToggle} />} */}
      {isMobile && (
        <img
          style={{
            padding: open ? "0 0 0 1rem" : "0 0 0 0.5rem"
          }}
          className={cx(styles.toggler)}
          onClick={handleSidebarToggle}
          src={searchIcon}
          alt='toggler'
        />
      )}
      <ul
        style={{
          padding: open ? "0 1rem" : "0",
          overflowX: isMobile && !open ? "hidden" : "auto"
        }}
      >
        {data.listItems.map((item, index) => (
          <li
            key={index}
            onClick={() => handleMenuClick(item.id)}
            className={activeLink.toString() === item.id.toString() ? activeMenuItemClass : ""}
          >
            {item?.component}
          </li>
        ))}
      </ul>
    </div>
  );
}

GenericSideBar.propTypes = {
  data: PropTypes.array,
  selectedMenuItem: PropTypes.func,
  activeMenuItemClass: PropTypes.string
};

export default GenericSideBar;
