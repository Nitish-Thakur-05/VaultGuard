import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import styles from "./modal.module.css";
import Input from "../input/Input";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import HttpsIcon from "@mui/icons-material/Https";
import SmartphoneOutlinedIcon from "@mui/icons-material/SmartphoneOutlined";
import { auth, db } from "../../firebase/Firebase.jsx";
import { setDoc, doc, arrayUnion, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import LoadingScreen from "../loadingScreen/LoadingScreen.jsx";

const Modal = ({
  closeModal,
  setUserData,
  setFilteredPasswords,
  modalType,
  editData,
  userData,
}) => {
  const [show, setShow] = useState(false);
  const [webPass, setWebPass] = useState(true);
  const [website, setWebsite] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingScreen, setIsLoadingScreen] = useState(false);
  const date = new Date();

  // stop scroll
  useEffect(() => {
    // disable scroll
    document.body.style.overflow = "hidden";

    return () => {
      // enable scroll when modal closes
      document.body.style.overflow = "auto";
    };
  }, []);

  // showing animation of modal
  useEffect(() => {
    requestAnimationFrame(() => setShow(true));
  }, []);

  // closing modal
  function handleCloseModal() {
    setShow(false);
    setTimeout(() => {
      closeModal();
    }, 200);
  }

  // edit existing password logic
  async function addEditedData() {
    const updatedPasswords = userData?.savedPasswords?.map((curr) =>
      curr.uniqueId === editData[0].uniqueId
        ? {
            ...curr,
            appName: website,
            userName: username,
            passkey: password,
            isThisAApp: webPass ? false : true,
          }
        : curr,
    );

    try {
      setIsLoadingScreen(true);
      await setDoc(
        doc(db, "userData", auth.currentUser.uid),
        { passwords: updatedPasswords },
        { merge: true },
      );

      setUserData((prev) => ({
        ...prev,
        savedPasswords: updatedPasswords,
      }));

      setFilteredPasswords(updatedPasswords);

      toast.success("Password updated successfully");
    } catch (error) {
      toast.error(
        "Unable to updated password, please try again after some time",
      );
    } finally {
      setIsLoadingScreen(false);
      closeModal();
    }
  }

  // adding given password to database
  async function saveData(e) {
    e.preventDefault();
    // condition check to run function
    if (isSaving) {
      return;
    } else if (!website.trim() || !username.trim() || !password.trim()) {
      toast.error("All fields are required");
      return;
    }

    // user can't click twice
    setIsSaving(true);

    // edit existing password
    if (modalType === "edit") {
      addEditedData();
      return;
    }

    // add new password logic
    try {
      setIsLoadingScreen(true);
      await setDoc(
        doc(db, "userData", auth.currentUser.uid),
        {
          passwords: arrayUnion({
            isThisAApp: webPass ? false : true,
            appName: website,
            userName: username,
            passkey: password,
            uniqueId: crypto.randomUUID(),
          }),
          lastUpdatedOn: `${date.toLocaleDateString()} (${date.toLocaleTimeString()})`,
        },
        { merge: true },
      );

      // storing dabasebase info to data variable
      const dataFromDb = await getDoc(
        doc(db, "userData", auth.currentUser.uid),
      );
      const data = dataFromDb.data();

      setUserData({
        name: data?.name || "",
        email: data?.email || "",
        savedPasswords: data?.passwords || [],
        message: data?.message || [],
        lastUpdatedOn: data?.lastUpdatedOn || "",
      });

      setFilteredPasswords(data?.passwords);

      // sucess message
      toast.success("Data updated");
      handleCloseModal();
    } catch (error) {
      console.log(error);
      toast.error("Unable to store data now");
    } finally {
      setIsSaving(false);
      setIsLoadingScreen(false);
    }
  }

  // edit password data fill in form
  useEffect(() => {
    if (modalType === "edit" && editData) {
      setWebsite(editData[0]?.appName || "");
      setUsername(editData[0]?.userName || "");
      setPassword(editData[0]?.passkey || "");
      setWebPass(!editData[0]?.isThisAApp);
    }
  }, [modalType, editData]);

  // jsx
  return createPortal(
    <div
      className={`${styles.overlay} ${show ? styles.showOverlay : ""}`}
      onClick={handleCloseModal}
    >
      {isLoadingScreen && <LoadingScreen />}
      <div
        className={`${styles.modalContainer} ${show ? styles.showModal : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.lockIcon}>
              <HttpsIcon sx={{ color: "#2dd4bf" }} />
            </div>
            <h2>Add New Password</h2>
          </div>
          <button className={styles.closeBtn} onClick={handleCloseModal}>
            ✕
          </button>
        </div>

        {/* TYPE */}
        <div className={styles.section}>
          <p className={styles.label}>Type</p>
          <div className={styles.typeRow}>
            <button
              onClick={() => {
                setWebPass(true);
              }}
              className={`${styles.typeBtn} ${webPass && styles.active}`}
            >
              <LanguageOutlinedIcon /> Website
            </button>
            <button
              onClick={() => {
                setWebPass(false);
              }}
              className={`${styles.typeBtn} ${!webPass && styles.active}`}
            >
              <SmartphoneOutlinedIcon /> App
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={(e) => saveData(e)}>
          <Input
            inputType="text"
            id="Website Name"
            value={website}
            setValue={setWebsite}
            ex="e.g., Google, Facebook"
          />

          <Input
            inputType="text"
            id="Username / Email"
            value={username}
            setValue={setUsername}
            ex="Enter your username or email"
          />

          <Input
            inputType={showPassword ? "text" : "password"}
            id="Password"
            value={password}
            setValue={setPassword}
            ex="Enter your password"
            showInputPassowrd={showPassword}
            setShowInputPassword={setShowPassword}
          />

          {/* FOOTER */}
          <div className={styles.footer}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={handleCloseModal}
            >
              Cancel
            </button>
            <button className={styles.saveBtn} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Password"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.querySelector("#portal"),
  );
};

export default Modal;
