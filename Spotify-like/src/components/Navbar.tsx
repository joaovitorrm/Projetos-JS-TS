const Navbar : React.FC = () => {

    return (
    <>
        <nav className="nav-bar">
            <div className="logo-div">
                <span className="logo">🛜</span>
            </div>
            <div className="search-div">
                <div className="nav-home-icon">🏠</div>
                <div className="search-bar">
                    <div className="lupa">🔍</div>
                    <input type="text" placeholder="O que você quer ouvir?" />
                </div>
            </div>
            <div className="right-nav">
                <div className="planos">
                    <div className="ver-plano">Ver planos Premium</div>
                    <div className="instalar"><div className="download-icon">⬇️</div>Instalar aplicativo</div>
                </div>
                <div className="icons">
                    <div className="notification">🔔</div>
                    <div className="perfil">😊</div>
                </div>
            </div>
        </nav>
    </>
    )
}

export default Navbar;