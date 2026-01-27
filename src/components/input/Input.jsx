import styles from "./input.module.css";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

const Input = ({
  inputType,
  id,
  value,
  setValue,
  ex,
  setShowInputPassword,
  showInputPassowrd,
  autoFocus,
}) => {
  return (
    <div className={styles.container}>
      <label htmlFor={id}>{id}</label>
      <input
        className={styles.input}
        type={inputType}
        id={id}
        placeholder={ex}
        name={id}
        autoComplete="off"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoFocus={autoFocus || false}
      />
      {inputType === "password" ? (
        <VisibilityOutlinedIcon
          onClick={() => {
            setShowInputPassword(true);
          }}
          className={styles.showPassIcon}
          sx={{ color: "hsl(215 20% 55%)", ":hover": { color: "white" } }}
        />
      ) : (
        showInputPassowrd && (
          <VisibilityOffOutlinedIcon
            onClick={() => {
              setShowInputPassword(false);
            }}
            className={styles.showPassIcon}
            sx={{ color: "hsl(215 20% 55%)", ":hover": { color: "white" } }}
          />
        )
      )}
    </div>
  );
};

export default Input;
