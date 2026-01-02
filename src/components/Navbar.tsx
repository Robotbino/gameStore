interface NavBarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  isOpen:boolean;
}
export default function NavBar({
  isSidebarOpen,
  setIsSidebarOpen,
}: NavBarProps) {
  function toggleSidebar() {
    setIsSidebarOpen(!isSidebarOpen);
    console.log("Toggled Sidebar:", isSidebarOpen);
  }

  return (
    <nav className="navbar ">
      <div>
        
        <button className="btn-toggle-sideBar" 
        onClick={toggleSidebar}>
        {isSidebarOpen ? "✕" : "☰"}
        </button>
        <label className="navbar-brand" >
          Game Store
        </label>
      </div>
      <div>
        <input
          type="text"
          placeholder="Search Games..."
          className="form-control"
        />
      </div>
    </nav>
  );
}
