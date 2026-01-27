import { useEffect, useState } from "react";
import styles from "./generatePasswordModal.module.css";
import { toast } from "react-toastify";
import CopyAllOutlinedIcon from "@mui/icons-material/CopyAllOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";

const GeneratePasswordModal = ({ onClose }) => {
  const [length, setLength] = useState(18);
  const [password, setPassword] = useState("!mdj3xF^&tti$?27");

  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumber, setIncludeNumber] = useState(true);
  const [includeSymbol, setIncludeSymbol] = useState(true);
  const [passwordStrength, setPasswordStrength] = useState("Strong");

  // stop scroll
  useEffect(() => {
    // disable scroll
    document.body.style.overflow = "hidden";

    return () => {
      // enable scroll when modal closes
      document.body.style.overflow = "auto";
    };
  }, []);

  // password generate
  const generatePassword = () => {
    let chars = "";
    if (includeUpper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLower) chars += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumber) chars += "0123456789";
    if (includeSymbol) chars += "!@#$%^&*()_+?";

    let newPass = "";
    for (let i = 0; i < length; i++) {
      newPass += chars[Math.floor(Math.random() * chars.length)];
    }

    if (includeUpper || includeLower || includeNumber || includeSymbol) {
      if (includeLower && includeUpper && includeNumber) {
        setPasswordStrength("Strong");
      } else if (
        (includeLower || includeUpper) &&
        (includeSymbol || includeNumber)
      ) {
        setPasswordStrength("Strong");
      } else if (includeUpper && includeLower) {
        setPasswordStrength("Medium");
      } else if (includeSymbol && includeNumber) {
        setPasswordStrength("Medium");
      } else {
        setPasswordStrength("Weak");
      }
      setPassword(newPass);
    } else {
      toast.warning("Select atleast one characteria");
    }
  };

  // copy password
  const copyPassword = () => {
    navigator.clipboard.writeText(password);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className={styles.header}>
          <h2>Password Generator</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.passwordBox}>
          <input value={password} readOnly />
          <div className={styles.icons}>
            <button onClick={copyPassword}>
              <CopyAllOutlinedIcon
                titleAccess="copy"
                sx={{ color: "#24f1dc" }}
              />
            </button>
            <button onClick={generatePassword}>
              <AutorenewOutlinedIcon
                titleAccess="re generate password"
                sx={{ color: "#24f1dc" }}
              />
            </button>
          </div>
        </div>

        <div
          className={styles.strengthBar}
          style={{
            color:
              passwordStrength == "Weak"
                ? "#B45253"
                : passwordStrength == "Medium"
                  ? "#FCB53B"
                  : passwordStrength == "Strong"
                    ? "#59AC77"
                    : "",
          }}
        >
          <div
            className={styles.strengthFill}
            style={{
              backgroundColor:
                passwordStrength == "Weak"
                  ? "#B45253"
                  : passwordStrength == "Medium"
                    ? "#FCB53B"
                    : passwordStrength == "Strong"
                      ? "#59AC77"
                      : "",
            }}
          />
          <span>{passwordStrength}</span>
        </div>

        <div className={styles.section}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h4>Password Length</h4>
            <div className={styles.lengthBox}>
              <span>{length}</span>
            </div>
          </div>
          <input
            type="range"
            min="8"
            max="32"
            value={length}
            onChange={(e) => setLength(e.target.value)}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ color: "#7588a3" }}>{8}</span>
            <span style={{ color: "#7588a3" }}>{32}</span>
          </div>
        </div>

        <div className={styles.section}>
          <h4>Include Characters</h4>

          <Toggle
            label="Uppercase (A-Z)"
            value={includeUpper}
            setValue={setIncludeUpper}
          />
          <Toggle
            label="Lowercase (a-z)"
            value={includeLower}
            setValue={setIncludeLower}
          />
          <Toggle
            label="Numbers (0-9)"
            value={includeNumber}
            setValue={setIncludeNumber}
          />
          <Toggle
            label="Symbols (!@#$%^&*)"
            value={includeSymbol}
            setValue={setIncludeSymbol}
          />
        </div>

        <button className={styles.generateBtn} onClick={generatePassword}>
          <AutorenewOutlinedIcon />
          Generate Password
        </button>
      </div>
    </div>
  );
};

const Toggle = ({ label, value, setValue }) => {
  return (
    <div className={styles.toggleRow}>
      <span>{label}</span>
      <div
        className={`${styles.toggle} ${value ? styles.active : ""}`}
        onClick={() => setValue(!value)}
      >
        <div className={styles.circle} />
      </div>
    </div>
  );
};

export default GeneratePasswordModal;
