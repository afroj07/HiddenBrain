import React from "react";
import styles from "./DefaultCard.module.css";

const DefaultCard = ({ category }) => {
  return (
    <div
      className={styles.card}
      style={{ backgroundColor: `${category.color}` }}
    >
      <div className={styles.cardText}>{category.name}</div>
      <div className={styles.ImageContainer}>
        <img className={styles.Image} src={category.img} alt="podcast-img" />
      </div>
    </div>
  );
};

export default DefaultCard;
