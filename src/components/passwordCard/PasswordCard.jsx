import styles from "../../pages/dashboard/dashboard.module.css";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import { useState } from "react";
import { toast } from "react-toastify";

const PasswordCard = ({
  id,
  appName,
  userId,
  password,
  icon,
  onDelete,
  onEdit,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // copy function
  async function copy(targetValue) {
    try {
      await navigator.clipboard.writeText(targetValue);
      toast.success("Data copied to clipboard");
    } catch (error) {
      toast.error("Unable to copy data to clipboard");
    }
  }

  // jsx
  return (
    <div
      className={styles.card}
      onContextMenu={(e) => {
        customContextMenu(e);
      }}
    >
      <div className={styles.cardTop}>
        <div className={styles.site}>
          <div className={styles.icon}>{icon}</div>
          <div className={styles.details}>
            <h3>{appName}</h3>
            <p>
              {userId}
              <ContentCopyRoundedIcon
                sx={{
                  fontSize: "medium",
                  ":hover": { color: "#24f1dc", backgroundColor: "#24f1dc33" },
                  color: "hsl(215 20% 55%)",
                  cursor: "pointer",
                }}
                titleAccess="Copy username"
              />
            </p>
          </div>
        </div>
        <div className={styles.actions1}>
          <ModeEditOutlineOutlinedIcon
            onClick={() => onEdit(id)}
            sx={{
              ":hover": { color: "white", backgroundColor: "#e5e7eb3b" },
              padding: "5px 5px",
              borderRadius: "10px",
            }}
            titleAccess="Edit"
          />
          {showPassword ? (
            <VisibilityOffOutlinedIcon
              sx={{
                ":hover": { color: "#14fa51ff", backgroundColor: "#14fa5150" },
                padding: "5px 5px",
                borderRadius: "10px",
              }}
              titleAccess="Show passowrd"
              onClick={() => {
                setShowPassword(false);
              }}
            />
          ) : (
            <VisibilityOutlinedIcon
              sx={{
                ":hover": { color: "#14fa51ff", backgroundColor: "#14fa5150" },
                padding: "5px 5px",
                borderRadius: "10px",
              }}
              titleAccess="Hide password"
              onClick={() => {
                setShowPassword(true);
              }}
            />
          )}
          <ContentCopyRoundedIcon
            sx={{
              ":hover": { color: "#24f1dc", backgroundColor: "#e5e7eb3b" },
              padding: "5px 5px",
              borderRadius: "10px",
            }}
            titleAccess="Copy password"
            onClick={() => {
              copy(password);
            }}
          />
          <DeleteOutlineOutlinedIcon
            onClick={() => onDelete(id)}
            sx={{
              ":hover": { color: "red", backgroundColor: "#f81c1c49" },
              padding: "5px 5px",
              borderRadius: "10px",
            }}
            titleAccess="Delete"
          />
        </div>
      </div>
      <hr
        style={{
          width: "100%",
          border: "1px solid #94a3b83b",
          marginBlock: "20px",
        }}
      />
      <div className={styles.passwordContainer}>
        <div className={styles.actions2}>
          <ModeEditOutlineOutlinedIcon onClick={() => onEdit(id)} />
          {showPassword ? (
            <VisibilityOffOutlinedIcon
              titleAccess="Show passowrd"
              onClick={() => {
                setShowPassword(false);
              }}
            />
          ) : (
            <VisibilityOutlinedIcon
              titleAccess="Hide password"
              onClick={() => {
                setShowPassword(true);
              }}
            />
          )}
          <ContentCopyRoundedIcon
            onClick={() => {
              copy(password);
            }}
          />
          <DeleteOutlineOutlinedIcon onClick={() => onDelete(id)} />
        </div>
        <p>Password</p>
        <input
          type={showPassword ? "text" : "password"}
          className={styles.password}
          value={password}
          readOnly={true}
        />
      </div>
    </div>
  );
};

export default PasswordCard;
