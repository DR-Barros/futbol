import React, { useEffect, useState } from "react";
import VoronoiDiagram from "./components/VoronoiDiagram";

const TacticsPage = () => {
    const [width, setWidth] = useState(Math.min(window.innerWidth, 500));

    useEffect(() => {
        const handleResize = () => setWidth(Math.min(window.innerWidth, 500));
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h1>Juega con la táctica ⚽</h1>
            <VoronoiDiagram width={width} height={width*1.5} />
        </div>
    );
};

export default TacticsPage;