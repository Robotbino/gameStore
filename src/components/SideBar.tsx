interface SideBarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  isOpen?: boolean;
}

export default function SideBar({ 
  isOpen,
  isSidebarOpen,
  setIsSidebarOpen }: SideBarProps) {
  function closeSidebar() {
    // Logic to close the sidebar
    setIsSidebarOpen(!isSidebarOpen);
  }
  

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <nav>
        <label className="sideBarTitleLabel" >GameStore</label>
        <button className="btn-toggle-sideBar" onClick={closeSidebar} >&#x2715;</button>
        <br/>
        <div className="userProfileSection" >
          <img className="userProfilePicture" src="src/assets/useProfileImg.png" alt="User Profile image" />
          <label>UserName</label>
        </div>

        <ul className="sideBarMenu">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/games">Games</a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
