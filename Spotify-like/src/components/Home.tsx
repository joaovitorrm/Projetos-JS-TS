import Artist from "./Artist";
import Library from "./Library";
import Music from "./Music";

const Home : React.FC = () => {

    return (
    <div className="home">        
        <Library />
        <Music />
        <Artist />
    </div>
    )
}

export default Home;