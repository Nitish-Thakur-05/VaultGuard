import styles from "./loadingScreen.module.css";

const LoadingScreen = () => {
  return (
    <div
      className={styles.container}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className={styles.loading}></div>
    </div>
  );
};

export default LoadingScreen;
