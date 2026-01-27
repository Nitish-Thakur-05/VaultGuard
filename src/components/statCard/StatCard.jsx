import styles from "../../pages/dashboard/dashboard.module.css";

const StatCard = ({ icon, data, cardName, bg, click }) => {
  return (
    <div className={styles.statCard} onClick={click}>
      <div className={styles.icon} style={bg && { backgroundColor: bg }}>
        {icon}
      </div>
      <div className={styles.data}>
        <h3>{data}</h3>
        <p>{cardName}</p>
      </div>
    </div>
  );
};

export default StatCard;
