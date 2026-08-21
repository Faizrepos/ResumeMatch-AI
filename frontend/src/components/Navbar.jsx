function Navbar() {
  return (
    <nav className="navbar">

      <a
        href="#top"
        className="logo"
      >
        Resume<span>Match</span>
      </a>


      <div className="nav-links">

        <a href="#analyzer">
          Analyzer
        </a>

        <a href="#how-it-works">
          How it works
        </a>

      </div>

    </nav>
  );
}


export default Navbar;