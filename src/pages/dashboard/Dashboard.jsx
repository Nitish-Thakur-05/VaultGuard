import styles from "./dashboard.module.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HttpsIcon from "@mui/icons-material/Https";
import SmartphoneOutlinedIcon from "@mui/icons-material/SmartphoneOutlined";
import LanguageIcon from "@mui/icons-material/Language";
import SettingsIcon from "@mui/icons-material/Settings";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import { auth, db } from "../../firebase/Firebase";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { useEffect, useState } from "react";
import StatCard from "../../components/statCard/StatCard";
import PasswordCard from "../../components/passwordCard/PasswordCard";
import GppMaybeOutlinedIcon from "@mui/icons-material/GppMaybeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import Modal from "../../components/modal/Modal";
import { useNavigate } from "react-router-dom";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import usePasswordCheck from "../../hooks/usePasswordCheck.js";
import LoadingScreen from "../../components/loadingScreen/LoadingScreen.jsx";
import GoToTopBtn from "../../components/goToTopBtn/GoToTopBtn.jsx";
// import SettingModal from "../../components/settingModal/SettingModal.jsx";
import AutoFixHighOutlinedIcon from "@mui/icons-material/AutoFixHighOutlined";
import GeneratePasswordModal from "../../components/generatePasswordModal/GeneratePasswordModal.jsx";
import { Suspense, lazy } from "react";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("password");
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isLoadingScreen, setIsLoadingScreen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredPasswords, setFilteredPasswords] = useState([]);
  const [modalType, setModalType] = useState("add");
  const [editData, setEditData] = useState(null);
  const [securePassword, setSecurePassword] = useState([]);
  const [atRiskPassword, setAtRishPassword] = useState([]);
  const SettingModal = lazy(
    () => import("../../components/settingModal/SettingModal.jsx"),
  );

  // getting userData
  useEffect(() => {
    if (!auth.currentUser) return;
    async function gettingUserData() {
      try {
        const dataFromDb = await getDoc(
          doc(db, "userData", auth.currentUser.uid),
        );
        const data = dataFromDb.data();

        // storing db data in local state
        setUserData({
          name: data?.name || "",
          email: data?.email || "",
          savedPasswords: data?.passwords || [],
          message: data?.message || [],
          lastUpdatedOn: data?.lastUpdatedOn || "",
          securePassKey: data?.securePassKey || "0",
        });

        // setting filtered data first time from db
        setFilteredPasswords(data?.passwords || []);
      } catch (error) {
        console.log(error);
      }
    }

    gettingUserData();
  }, [auth.currentUser]);

  // getting secure passowrd
  useEffect(() => {
    const securePass = userData?.savedPasswords?.filter((curr) =>
      usePasswordCheck(curr.passkey),
    );
    setSecurePassword(securePass);
  }, [userData]);

  // getting at risk passowrd
  useEffect(() => {
    const atRiskPass = userData?.savedPasswords?.filter(
      (curr) => !usePasswordCheck(curr.passkey),
    );
    setAtRishPassword(atRiskPass);
  }, [userData]);

  // default behaviour of sidebar open in desktop
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 901) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    }
    // run once on mount
    handleResize();
    // listen to resize
    window.addEventListener("resize", handleResize);
    // cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // open sidebar in mobile
  function openSidebar(e) {
    e.stopPropagation();
    setSidebarOpen((prev) => !prev);
  }

  // close sidebar in mobile
  function closeSidebar(e) {
    if (window.innerWidth <= 900) {
      setSidebarOpen(false);
    }
  }

  // close modal
  function closeModal() {
    setIsModalOpen(false);
    setEditData(null);
    setModalType("add");
  }

  // scroll to top
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // search function
  function search(e) {
    const value = e.target.value.toLowerCase();
    setSearchValue(e.target.value);
    const searchedData = userData?.savedPasswords?.filter((curr) => {
      return curr.appName.toLowerCase().includes(value);
    });
    setFilteredPasswords(searchedData);
  }

  // delete password card
  async function handleDeletePassword(id) {
    // calculate updated passwords
    const updatedPasswords = userData.savedPasswords.filter(
      (curr) => curr.uniqueId !== id,
    );

    try {
      setIsLoadingScreen(true);
      // update on server
      await setDoc(
        doc(db, "userData", auth.currentUser.uid),
        {
          passwords: updatedPasswords,
        },
        { merge: true },
      );

      // updated data in local state
      setUserData((prev) => ({
        ...prev,
        savedPasswords: updatedPasswords,
      }));

      // update filtered data in local state
      setFilteredPasswords(updatedPasswords);
      toast.success("Entry deleted successfully");
    } catch (error) {
      toast.error("Unable to delete now");
    } finally {
      setIsLoadingScreen(false);
    }
  }

  async function edit(id) {
    const editableData = userData?.savedPasswords.filter(
      (curr) => curr.uniqueId === id,
    );
    if (!editableData) return;
    setIsModalOpen(true);
    setModalType("edit");
    setEditData(editableData);
  }

  // jsx
  return (
    <div className={styles.app} onClick={(e) => closeSidebar(e)}>
      {/* toast container  */}
      <ToastContainer
        theme="colored"
        closeOnClick
        newestOnTop
        autoClose={2000}
      />

      {/* loading  */}
      {(!userData || isLoadingScreen) && <LoadingScreen />}

      {/* Sidebar */}
      <aside
        className={`${styles.sidebar}`}
        style={
          sidebarOpen ? { display: "flex", left: "0" } : { display: "none" }
        }
      >
        <div className={styles.brand}>
          <div className={styles.logo}>
            {auth.currentUser.photoURL ? (
              <img
                src={auth.currentUser.photoURL}
                alt="profile pic"
                referrerPolicy="no-referrer"
              />
            ) : (
              <AccountCircleIcon sx={{ fontSize: "60px" }} />
            )}
          </div>
          <div className={styles.userDetails}>
            <h2>{userData?.name || "Guest"}</h2>
            <p>{userData?.email || "name@example.com"}</p>
          </div>
        </div>

        <button
          onClick={() => {
            setIsModalOpen(true);
          }}
          className={styles.addBtn}
        >
          ＋ Add New Password
        </button>

        {isModalOpen && (
          <Modal
            closeModal={closeModal}
            setUserData={setUserData}
            setFilteredPasswords={setFilteredPasswords}
            modalType={modalType}
            editData={editData}
            userData={userData}
          />
        )}

        <nav className={styles.menu}>
          {/* menuItem  */}
          <div
            onClick={() => {
              setActiveSection("password");
            }}
            className={`${styles.menuItem} ${
              activeSection === "password" ? styles.active : ""
            }`}
          >
            <span>
              <HttpsIcon sx={{ fontSize: "larger" }} />
              <span style={{ paddingLeft: "8px" }}>Passwords</span>
            </span>
            <span className={styles.badge}>
              {userData?.savedPasswords?.length || "0"}
            </span>
          </div>
          {/* menuItem  */}
          <div
            onClick={() => {
              setActiveSection("generate password");
            }}
            className={`${styles.menuItem} ${
              activeSection === "generate password" ? styles.active : ""
            }`}
          >
            <span>
              <AutoFixHighOutlinedIcon sx={{ fontSize: "larger" }} />
              <span style={{ paddingLeft: "8px", textWrap: "nowrap" }}>
                Generate Password
              </span>
            </span>
          </div>
          {/* menuItem  */}
          <div
            onClick={() => {
              setActiveSection("setting");
            }}
            className={`${styles.menuItem} ${
              activeSection === "setting" ? styles.active : ""
            }`}
          >
            <span>
              <SettingsIcon sx={{ fontWeight: "larger" }} />
              <span style={{ paddingLeft: "8px" }}>Setting</span>
            </span>
          </div>

          {activeSection == "setting" && (
            <Suspense fallback={<LoadingScreen />}>
              <SettingModal setActiveSection={setActiveSection} />
            </Suspense>
          )}
        </nav>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        {/* titile  */}
        <div className={styles.title}>
          <div>
            <h1 className={styles.titleHead}>All Passwords</h1>
            <p className={styles.subtitle}>
              Securely manage and access all your saved credentials.
            </p>
          </div>
          <div className={styles.hamber} onClick={(e) => openSidebar(e)}>
            <MenuOutlinedIcon sx={{ fontSize: "2.5rem" }} />
          </div>
        </div>

        {/* StatWide */}
        <div className={styles.statWide}>
          <div>
            <p>Last Updated</p>
            <h5>{userData?.lastUpdatedOn}</h5>
          </div>
          <p className={styles.encryptStatusDesktop}>passwords encrypted</p>
          <p className={styles.encryptStatusMobile}>encrypted</p>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          {/* statcard  */}
          <StatCard
            icon={<KeyOutlinedIcon sx={{ fontSize: "larger" }} />}
            cardName="Total"
            data={userData?.savedPasswords?.length || "0"}
            click={() => {
              setFilteredPasswords(userData?.savedPasswords);
            }}
          />

          {/* statcard  */}
          <StatCard
            icon={
              <ShieldOutlinedIcon
                sx={{ fontSize: "large", color: "rgb(31, 240, 31)" }}
              />
            }
            cardName="Secure"
            data={securePassword?.length || "0"}
            bg="rgba(25, 213, 25, 0.274)"
            click={() => {
              setFilteredPasswords(securePassword);
            }}
          />

          {/* statcard  */}
          <StatCard
            icon={
              <GppMaybeOutlinedIcon sx={{ fontSize: "larger", color: "red" }} />
            }
            cardName="At Risk"
            data={atRiskPassword?.length || "0"}
            bg="rgba(255, 35, 35, 0.27)"
            click={() => {
              setFilteredPasswords(atRiskPassword);
            }}
          />

          {/* statcard  */}
          <StatCard
            icon={
              <NotificationsOutlinedIcon
                sx={{ fontSize: "larger", color: "blue" }}
              />
            }
            cardName="Notification"
            data={userData?.message?.length || "0"}
            bg="rgba(35, 50, 255, 0.27)"
          />
        </div>

        {/* Search */}
        <div className={styles.searchBox}>
          <SearchOutlinedIcon className={styles.searchIcon} />
          <input
            type="search"
            className={styles.search}
            placeholder="Search passwords..."
            value={searchValue}
            onChange={(e) => search(e)}
          />
        </div>

        {/* Password Cards */}
        {filteredPasswords.length > 0 ? (
          filteredPasswords.map((curr, i) => {
            return (
              <PasswordCard
                id={curr.uniqueId}
                key={curr.uniqueId}
                password={curr.passkey || "••••••••••"}
                userId={curr.userName}
                appName={curr.appName}
                icon={
                  curr.isThisAApp ? (
                    <SmartphoneOutlinedIcon />
                  ) : (
                    <LanguageIcon />
                  )
                }
                onDelete={handleDeletePassword}
                onEdit={edit}
              />
            );
          })
        ) : (
          <div style={{ fontWeight: "600", textAlign: "center" }}>
            No saved password
          </div>
        )}
        {/* scroll to top btn  */}
        <GoToTopBtn onClick={scrollToTop} />
        {activeSection == "generate password" && (
          <GeneratePasswordModal onClose={() => setActiveSection("password")} />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
