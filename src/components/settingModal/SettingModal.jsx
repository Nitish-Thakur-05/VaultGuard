import { createPortal } from "react-dom";
import styles from "./settingModal.module.css";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import CloseIcon from "@mui/icons-material/Close";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useEffect, useState } from "react";
import EnhancedEncryptionOutlinedIcon from "@mui/icons-material/EnhancedEncryptionOutlined";
import PolicyOutlinedIcon from "@mui/icons-material/PolicyOutlined";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase/Firebase.jsx";
import { toast } from "react-toastify";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import Input from "../input/Input";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  deleteUser,
} from "firebase/auth";
import { deleteDoc, doc } from "firebase/firestore";

const SettingModal = ({ setActiveSection }) => {
  const [btnOn, setBtnOn] = useState(true);
  const [showPolicy, setShowPolicy] = useState(false);
  const [showChangePass, setShowChangePass] = useState(false);
  const [showInputPassowrd, setShowInputPassword] = useState(false);
  const [currentPassword, setCurrentpassword] = useState("");
  const [newPassword, setNewpassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isBtnClicked, setIsBtnClicked] = useState(false);
  const [isDeleteBtnClicked, setDeleteIsBtnClicked] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeleteUserSlide, setShowDeleteUserSlide] = useState(false);

  // logout
  async function logout() {
    if (!auth.currentUser) return;
    try {
      signOut(auth);
    } catch (error) {
      toast.error("Unable to log out now.");
    }
  }

  // change password
  async function changePassword(e) {
    e.preventDefault();
    if (
      !currentPassword.trim() ||
      !newPassword.trim() ||
      !confirmPassword.trim()
    ) {
      toast.warning("please fill all the fields");
      return;
    } else if (newPassword !== confirmPassword) {
      toast.warning("new password and confirm password must be same");
      return;
    }

    // changing password
    try {
      setIsBtnClicked(true);
      if (!auth.currentUser) return;

      // Create credential using current password
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword,
      );

      // Reauthenticate (to check current password)
      await reauthenticateWithCredential(auth.currentUser, credential);

      // If reauthentication successful then update password
      await updatePassword(auth.currentUser, newPassword);
      toast.success("Password updated successfully!");
      setActiveSection("password");
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        toast.error("Current password is incorrect");
      } else if (error.code == "auth/password-does-not-meet-requirements") {
        toast.warning(
          "Password must be at least 6 characters and include uppercase, lowercase, number, and special character.",
        );
      } else {
        toast.error("Unable to change password right now");
      }
    } finally {
      setIsBtnClicked(false);
    }
  }

  // delete user
  async function removeUser() {
    if (!deletePassword.trim()) {
      toast.warning("Enter Your Password");
    } else {
      try {
        setDeleteIsBtnClicked(true);
        const user = auth.currentUser;
        if (!user) return;

        // Create credential from entered password
        const credential = EmailAuthProvider.credential(
          user.email,
          deletePassword,
        );

        // Reauthenticate (this checks password)
        await reauthenticateWithCredential(user, credential);

        // Delete Firestore data
        await deleteDoc(doc(db, "userData", user.uid));

        // Delete Auth user
        await deleteUser(user);

        toast.success("Account deleted permanently.");
      } catch (error) {
        if (error.code === "auth/invalid-credential") {
          toast.error("Incorrect password.");
        } else {
          toast.error("Unable to delete account.");
        }
      } finally {
        setDeleteIsBtnClicked(false);
      }
    }
  }

  //stop scroll
  useEffect(() => {
    // disable scroll
    document.body.style.overflow = "hidden";

    return () => {
      // enable scroll when modal closes
      document.body.style.overflow = "auto";
    };
  }, []);

  return createPortal(
    <div
      className={styles.overlay}
      onClick={() => {
        setActiveSection("password");
      }}
    >
      <div
        className={styles.settingContainer}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/* header  */}
        <div className={styles.header}>
          <div className={styles.headerIcon}>
            <PaletteOutlinedIcon
              sx={{
                padding: "8px 8px",
                backgroundColor: "#21e3d048",
                borderRadius: "10px",
                color: "#24f1dc",
              }}
            />
            <h3>Setting</h3>
          </div>
          <CloseIcon
            onClick={() => {
              setActiveSection("password");
            }}
            sx={{ cursor: "pointer" }}
          />
        </div>

        <hr />

        {/* body  */}
        <div className={styles.body}>
          {/* theme section  */}
          <div className={styles.section}>
            <h4 className={styles.title}>Theme</h4>
            <div className={styles.card}>
              <div className={styles.text}>
                <DarkModeIcon
                  sx={{
                    padding: "8px 8px",
                    backgroundColor: "#21e3d048",
                    borderRadius: "10px",
                    color: "#24f1dc",
                  }}
                />
                <div>
                  <h4 className={styles.heading}>Night Mode</h4>
                  <p className={styles.subHeading}>Switch between theme</p>
                </div>
              </div>

              <div
                className={`${styles.btnOuter} ${btnOn && styles.btnActive}`}
                onClick={() => {
                  setBtnOn((prev) => !prev);
                }}
              >
                <div className={styles.btnInner}></div>
              </div>
            </div>
          </div>

          {/* security section  */}
          <div className={styles.section}>
            <h4 className={styles.title}>Security</h4>
            <div
              className={styles.card}
              style={{ cursor: "pointer" }}
              onClick={() => {
                setShowChangePass((prev) => !prev);
              }}
            >
              <div className={styles.text}>
                <EnhancedEncryptionOutlinedIcon
                  sx={{
                    padding: "8px 8px",
                    backgroundColor: "#21e3d048",
                    borderRadius: "10px",
                    color: "#24f1dc",
                  }}
                />
                <div>
                  <h4 className={styles.heading}>Change Password</h4>
                </div>
              </div>

              <div style={{ color: "#24dbc9" }}>
                {showChangePass ? (
                  <KeyboardArrowUpOutlinedIcon />
                ) : (
                  <KeyboardArrowDownOutlinedIcon />
                )}
              </div>
            </div>

            {/* change password slide  */}
            {showChangePass && (
              <div className={styles.card} style={{ display: "block" }}>
                <form onSubmit={changePassword}>
                  <Input
                    inputType={showInputPassowrd ? "text" : "password"}
                    id="Current Password"
                    value={currentPassword}
                    setValue={setCurrentpassword}
                    showInputPassowrd={showInputPassowrd}
                    setShowInputPassword={setShowInputPassword}
                    ex="***************"
                  />

                  <Input
                    inputType={showInputPassowrd ? "text" : "password"}
                    id="New Password"
                    value={newPassword}
                    setValue={setNewpassword}
                    showInputPassowrd={setNewpassword}
                    setShowInputPassword={setShowInputPassword}
                    ex="***************"
                  />

                  <Input
                    inputType={showInputPassowrd ? "text" : "password"}
                    id="Confirm Password"
                    value={confirmPassword}
                    setValue={setConfirmPassword}
                    showInputPassowrd={showInputPassowrd}
                    setShowInputPassword={setShowInputPassword}
                    ex="***************"
                  />

                  <button
                    className={styles.ChangePassBtn}
                    disabled={isBtnClicked}
                  >
                    {isBtnClicked ? (
                      <span className={styles.loading}>
                        <span className={styles.dots}>
                          <span>.</span>
                          <span>.</span>
                          <span>.</span>
                        </span>
                      </span>
                    ) : (
                      "Change"
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* card */}
            <div className={styles.card}>
              <div className={styles.text}>
                <PolicyOutlinedIcon
                  sx={{
                    padding: "8px 8px",
                    backgroundColor: "#21e3d048",
                    borderRadius: "10px",
                    color: "#24f1dc",
                  }}
                />
                <div>
                  <h4 className={styles.heading}>Privacy Policy</h4>
                </div>
              </div>

              <div
                className={styles.btn}
                onClick={() => {
                  setShowPolicy((prev) => !prev);
                }}
              >
                {showPolicy ? "Hide" : "View"}
              </div>
            </div>

            {/* privicy slide */}
            {showPolicy && (
              <div className={styles.card} style={{ display: "block" }}>
                <p>
                  <b style={{ color: "#24dbc9" }}>Effective: </b> Jan 26, 2026
                </p>
                <p>
                  We collect only email, encrypted passwords (end-to-end, never
                  accessible by us), and anonymized usage data. No selling or
                  sharing with third parties.
                </p>
                <p>
                  <b style={{ color: "#24dbc9" }}>Uses: </b> Secure service
                  delivery, essential emails, service improvements.
                </p>
                <p>
                  <b style={{ color: "#24dbc9" }}>Security: </b> AES-256
                  encryption, 2FA, regular audits (GDPR/CCPA compliant).
                </p>
                <p>
                  <b style={{ color: "#24dbc9" }}>Your Rights: </b>{" "}
                  Access/delete data via account; email
                  privacy@[yourwebsite].com.
                </p>
                <p>
                  <b style={{ color: "#24dbc9" }}>Devloper: </b> Nitish Thakur
                </p>
                <p>
                  <b style={{ color: "#24dbc9" }}> Contact Us: </b>
                  idhoster4@gmail.com.
                </p>
                <p>
                  <b style={{ color: "#24dbc9" }}>Github: </b>{" "}
                  <a href="https://shorturl.at/iwWDD" style={{color: "white"}}>
                    https://shorturl.at/iwWDD
                  </a>
                </p>

                <p
                  style={{
                    textAlign: "end",
                    color: "#7588a3",
                    marginBottom: "0",
                  }}
                >
                  Version 1.0.0
                </p>
              </div>
            )}
          </div>

          {/* data section  */}
          <div className={styles.section}>
            <h4 className={styles.title}>Data</h4>
            <div className={styles.card}>
              <div className={styles.text}>
                <FileUploadOutlinedIcon
                  sx={{
                    padding: "8px 8px",
                    backgroundColor: "#21e3d048",
                    borderRadius: "10px",
                    color: "#24f1dc",
                  }}
                />
                <div>
                  <h4 className={styles.heading}>Export Passwords</h4>
                  <p className={styles.subHeading}>(Experimental)</p>
                </div>
              </div>

              <div className={styles.btn}>Export</div>
            </div>
          </div>

          {/* account section  */}
          <div className={styles.section}>
            <h4 className={styles.title}>Account</h4>
            <div className={styles.card}>
              <div className={styles.text}>
                <LogoutOutlinedIcon
                  sx={{
                    padding: "8px 8px",
                    backgroundColor: "#21e3d048",
                    borderRadius: "10px",
                    color: "#24f1dc",
                  }}
                />
                <div>
                  <h4 className={styles.heading}>Logout</h4>
                </div>
              </div>

              <div
                className={styles.btn}
                style={{ color: "rgb(216, 46, 46)", border: "1px solid red" }}
                onClick={logout}
              >
                Log Out
              </div>
            </div>

            {/* card  */}
            <div className={styles.card}>
              <div className={styles.text}>
                <DeleteForeverOutlinedIcon
                  sx={{
                    padding: "8px 8px",
                    backgroundColor: "#21e3d048",
                    borderRadius: "10px",
                    color: "#24f1dc",
                  }}
                />
                <div>
                  <h4 className={styles.heading}>Delete My Account</h4>
                </div>
              </div>

              <div
                className={styles.btn}
                style={{ color: "rgb(216, 46, 46)", border: "1px solid red" }}
                onClick={() => {
                  setShowDeleteUserSlide((prev) => !prev);
                }}
              >
                Delete
              </div>
            </div>

            {/* delete user slide  */}
            {showDeleteUserSlide && (
              <div className={styles.card} style={{ display: "block" }}>
                <h4 style={{ textAlign: "center", margin: "0" }}>Caution</h4>
                <hr />
                <p style={{ textAlign: "center" }}>
                  Account deletion is permanent. Once deleted, all encrypted
                  passwords and related data will be permanently erased from our
                  system and cannot be recovered.
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                    gap: "15px",
                  }}
                >
                  <Input
                    inputType={showInputPassowrd ? "text" : "password"}
                    id="Enter Password"
                    value={deletePassword}
                    setValue={setDeletePassword}
                    showInputPassowrd={showInputPassowrd}
                    setShowInputPassword={setShowInputPassword}
                    ex="***************"
                  />
                  <button
                    className={styles.deleteAccountBtn}
                    onClick={removeUser}
                    disabled={isDeleteBtnClicked}
                  >
                    {isDeleteBtnClicked ? (
                      <span className={styles.loading}>
                        <span className={styles.dots}>
                          <span>.</span>
                          <span>.</span>
                          <span>.</span>
                        </span>
                      </span>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* about section  */}
          <div className={styles.section}>
            <div className={styles.aboutCard}>
              <ShieldOutlinedIcon
                sx={{
                  padding: "8px 8px",
                  backgroundColor: "#21e3d048",
                  borderRadius: "10px",
                  color: "#24f1dc",
                }}
              />
              <div className={styles.aboutText}>
                <h4 className={styles.heading}>VaultGuard v1.0.0</h4>
                <p className={styles.subHeading}>
                  Your secure password manager
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.querySelector("#portal"),
  );
};

export default SettingModal;
