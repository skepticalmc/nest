import Bots from "@/components/bots";
import { Divider } from "@nextui-org/react";

const Home = () => {
    return (
        <div className="page">
            <h1 className="font-bold">
                Empowering{" "}
                <span style={{ color: "#F5C400" }}>Guilded</span>
                {" "}Bots
            </h1>
            <p>Explore millions of Guilded bots.</p>
            <Divider className="my-2" />
            <Bots searchBar={true} />
        </div>
    );
};

export default Home;