const Library : React.FC = () => {

    return (
    <div className="library-div">
        <div className="library-title">
            <span>💾</span>
            <h2>Sua Biblioteca</h2>
            <span className="criar">+</span>
            <span className="mostrar-mais">➡️</span>
        </div>
        <div className="filter">
            <span>Playlists</span>
            <span>Artistas</span>
            <span>Álbuns</span>
            <span>Podcasts e programas</span>
        </div>
        <div className="library-search">
            <span className="library-search-icon">🔍</span>
            <div>Recentes🟰</div>
        </div>
    </div>
    )
}

export default Library;