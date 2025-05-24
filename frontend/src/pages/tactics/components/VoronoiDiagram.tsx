import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

interface Point {
    x: number;
    y: number;
    name: string;
    team: number;
}

const VoronoiDiagram = ({ width = 400, height = 600 }) => {
    const [winndowsWidth, setWindowsWidth] = useState(window.innerWidth);
    useEffect(() => {
        const handleResize = () => {
            setWindowsWidth(window.innerWidth);
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const formaciones = [
        { name: "4-4-2", positions: [
            { name: "Portero", x: 0.5, y: 0.08 }, 
            { name: "Lateral Derecho", x: 0.15, y: 0.20 },
            { name: "Defensa Central", x: 0.35, y: 0.20 },
            { name: "Defensa Central", x: 0.65, y: 0.20 },
            { name: "Lateral Izquierdo", x: 0.85, y: 0.20 },
            { name: "Centrocampista Derecho", x: 0.15, y: 0.45 },
            { name: "Centrocampista", x: 0.35, y: 0.45 },
            { name: "Centrocampista", x: 0.65, y: 0.45 },
            { name: "Centrocampista Izquierdo", x: 0.85, y: 0.45 },
            { name: "Delantero", x: 0.35, y: 0.75 },
            { name: "Delantero", x: 0.65, y: 0.75 }
        ]},
        { name: "4-3-3", positions: [
            { name: "Portero", x: 0.5, y: 0.08 }, 
            { name: "Lateral Derecho", x: 0.15, y: 0.20 },
            { name: "Defensa Central", x: 0.35, y: 0.20 },
            { name: "Defensa Central", x: 0.65, y: 0.20 },
            { name: "Lateral Izquierdo", x: 0.85, y: 0.20 },
            { name: "Centrocampista Derecho", x: 0.25, y: 0.45 },
            { name: "Centrocampista", x: 0.5, y: 0.45 },
            { name: "Centrocampista", x: 0.75, y: 0.45 },
            { name: "Delantero Derecho", x: 0.25, y: 0.75 },
            { name: "Delantero", x: 0.5, y: 0.85 },
            { name: "Delantero Izquierdo", x: 0.75, y: 0.75 }
        ]},
        { name: "4-2-3-1", positions: [
            { name: "Portero", x: 0.5, y: 0.08 }, 
            { name: "Lateral Derecho", x: 0.15, y: 0.20 },
            { name: "Defensa Central", x: 0.35, y: 0.20 },
            { name: "Defensa Central", x: 0.65, y: 0.20 },
            { name: "Lateral Izquierdo", x: 0.85, y: 0.20 },
            { name: "Centrocampista", x: 0.35, y: 0.45 },
            { name: "Centrocampista", x: 0.65, y: 0.45 },
            { name: "Centrocampista", x: 0.5, y: 0.6 },
            { name: "Delantero Derecho", x: 0.25, y: 0.6 },
            { name: "Delantero", x: 0.5, y: 0.75 },
            { name: "Delantero Izquierdo", x: 0.75, y: 0.6 }
        ]},
        { name: "3-4-3", positions: [
            { name: "Portero", x: 0.5, y: 0.08 }, 
            { name: "Defensa Central", x: 0.25, y: 0.20 },
            { name: "Defensa Central", x: 0.5, y: 0.20 },
            { name: "Defensa Central", x: 0.75, y: 0.20 },
            { name: "Centrocampista Derecho", x: 0.15, y: 0.45 },
            { name: "Centrocampista", x: 0.35, y: 0.45 },
            { name: "Centrocampista", x: 0.65, y: 0.45 },
            { name: "Centrocampista Izquierdo", x: 0.85, y: 0.45 },
            { name: "Delantero", x: 0.25, y: 0.6 },
            { name: "Delantero", x: 0.5, y: 0.75 },
            { name: "Delantero Izquierdo", x: 0.75, y: 0.6 }
        ]},
        { name: "3-5-2", positions: [
            { name: "Portero", x: 0.5, y: 0.08 }, 
            { name: "Defensa Central", x: 0.25, y: 0.20 },
            { name: "Defensa Central", x: 0.5, y: 0.20 },
            { name: "Defensa Central", x: 0.75, y: 0.20 },
            { name: "Centrocampista Derecho", x: 0.15, y: 0.45 },
            { name: "Centrocampista", x: 0.35, y: 0.45 },
            { name: "Centrocampista", x: 0.5, y: 0.45 },
            { name: "Centrocampista", x: 0.65, y: 0.45 },
            { name: "Centrocampista Izquierdo", x: 0.85, y: 0.45 },
            { name: "Delantero", x: 0.35, y: 0.75 },
            { name: "Delantero", x: 0.65, y: 0.75 }
        ]},
        { name: "5-4-1", positions: [
            { name: "Portero", x: 0.5, y: 0.08 }, 
            { name: "Lateral Derecho", x: 0.1, y: 0.2 },
            { name: "Defensa Central", x: 0.3, y: 0.2 },
            { name: "Defensa Central", x: 0.5, y: 0.2 },
            { name: "Defensa Central", x: 0.7, y: 0.2 },
            { name: "Lateral Izquierdo", x: 0.9, y: 0.2 },
            { name: "Centrocampista Derecho", x: 0.15, y: 0.45 },
            { name: "Centrocampista", x: 0.35, y: 0.45 },
            { name: "Centrocampista", x: 0.65, y: 0.45 },
            { name: "Centrocampista Izquierdo", x: 0.85, y: 0.45 },
            { name: "Delantero", x: 0.5, y: 0.75 }
        ]},
        { name: "5-3-2", positions: [
            { name: "Portero", x: 0.5, y: 0.08 }, 
            { name: "Lateral Derecho", x: 0.1, y: 0.3 },
            { name: "Defensa Central", x: 0.3, y: 0.2 },
            { name: "Defensa Central", x: 0.5, y: 0.2 },
            { name: "Defensa Central", x: 0.7, y: 0.2 },
            { name: "Lateral Izquierdo", x: 0.9, y: 0.3 },
            { name: "Centrocampista", x: 0.25, y: 0.45 },
            { name: "Centrocampista", x: 0.5, y: 0.45 },
            { name: "Centrocampista", x: 0.75, y: 0.45 },
            { name: "Delantero", x: 0.35, y: 0.75 },
            { name: "Delantero", x: 0.65, y: 0.75 }
        ]}
    ];
    const teamSize = 11;
    const svgRef = useRef<SVGSVGElement | null>(null);

    // Estado para formaciones seleccionadas
    const [selectedFormation1, setSelectedFormation1] = useState(formaciones[0].name);
    const [selectedFormation2, setSelectedFormation2] = useState(formaciones[0].name);

    // Genera los puntos iniciales según la formación seleccionada
    const getPointsFromFormations = (formation1Name: string, formation2Name: string) => {
        const f1 = formaciones.find(f => f.name === formation1Name);
        const f2 = formaciones.find(f => f.name === formation2Name);
        // Si alguna formación no tiene suficientes posiciones, rellena con random
        const f1Points = (f1?.positions ?? []).map(p => ({
            x: p.x * width,
            y: p.y * height,
            name: p.name,
            team: 1,
        }));
        const f2Points = (f2?.positions ?? []).map(p => ({
            x: (1 -p.x) * width,
            y: (1 - p.y) * height,
            name: p.name,
            team: 2,
        }));
        // Rellenar si faltan jugadores
        while (f1Points.length < teamSize) {
            f1Points.push({
                x: Math.random() * (width * 0.4) + width * 0.05,
                y: Math.random() * (height * 0.9) + height * 0.05,
                name: "Extra",
                team: 1,
            });
        }
        while (f2Points.length < teamSize) {
            f2Points.push({
                x: Math.random() * (width * 0.4) + width * 0.55,
                y: Math.random() * (height * 0.9) + height * 0.05,
                name: "Extra",
                team: 2,
            });
        }
        return [...f1Points, ...f2Points];
    };

    // Estado de puntos, inicializado según formaciones
    const [points, setPoints] = useState<Point[]>(getPointsFromFormations(selectedFormation1, selectedFormation2));
    const [ballPosition, setBallPosition] = useState([width * 0.5, height * 0.5]);

    // Actualiza los puntos cuando cambian las formaciones
    useEffect(() => {
        setPoints(getPointsFromFormations(selectedFormation1, selectedFormation2));
        setBallPosition([width * 0.5, height * 0.5]);
    }, [selectedFormation1, selectedFormation2, width, height]);

    const optionsColor = [
        { name: "Azul", value: "#0033cc" },
        { name: "Rojo", value: "#cc0000" },
        { name: "Verde", value: "#00cc33" },
        { name: "Amarillo", value: "#cccc00" },
        { name: "Naranja", value: "#cc6600" },
        { name: "Morado", value: "#6600cc" },
    ]
    const [team1Color, setTeam1Color] = useState(optionsColor[0].value);
    const [team2Color, setTeam2Color] = useState(optionsColor[1].value);
    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        // Fondo verde
        svg.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "#228B22");

        // Dibujar líneas de la cancha
        svg.append("line")
            .attr("x1", 0)
            .attr("y1", height * 0.5)
            .attr("x2", width)
            .attr("y2", height * 0.5)
            .attr("stroke", "#000")
            .attr("stroke-width", 3);
        svg.append("ellipse")
            .attr("cx", width * 0.5)
            .attr("cy", height * 0.5)
            .attr("rx", height * 0.1)
            .attr("ry", height * 0.1)
            .attr("stroke", "#000")
            .attr("stroke-width", 3)
            .attr("fill", "none");
        //dibujar el área de penalti
        // Área de penalti superior
        svg.append("rect")
            .attr("x", width * 0.25)
            .attr("y", 0)
            .attr("width", width * 0.5)
            .attr("height", height * 0.12)
            .attr("stroke", "#000")
            .attr("stroke-width", 3)
            .attr("fill", "none");
        // Área de penalti inferior
        svg.append("rect")
            .attr("x", width * 0.25)
            .attr("y", height * 0.88)
            .attr("width", width * 0.5)
            .attr("height", height * 0.12)
            .attr("stroke", "#000")
            .attr("stroke-width", 3)
            .attr("fill", "none");

        const delaunay = d3.Delaunay.from(points, (d) => d.x, (d) => d.y);
        const voronoi = delaunay.voronoi([0, 0, width, height]);

        // Dibujar regiones solo con borde, sin color de fondo
        for (let i = 0; i < points.length; i++) {
            svg
            .append("path")
            .attr("d", voronoi.renderCell(i))
            .attr("stroke", points[i].team === 1 ? team1Color : team2Color)
            .attr("fill", "none");
        }

        // Dibujar y hacer drag en los puntos
        svg
            .selectAll("circle.player")
            .data(points)
            .enter()
            .append("circle")
            .attr("class", "player")
            .attr("r", 8)
            .attr("fill", (d: Point) => (d.team === 1 ? team1Color : team2Color))
            .attr("cx", (d: Point) => d.x)
            .attr("cy", (d: Point) => d.y)
            .on("mouseover", function (event: any, d: Point) {
            // Mostrar tooltip
            const [x, y] = d3.pointer(event, svg.node());
            svg.append("text")
                .attr("id", "tooltip")
                .attr("x", x + 10)
                .attr("y", y - 10)
                .attr("fill", "#fff")
                .attr("stroke", "#000")
                .attr("stroke-width", 0.5)
                .attr("font-size", 16)
                .attr("font-family", "sans-serif")
                .text(d.name);
            })
            .on("mousemove", function (event: any) {
            // Mover tooltip
            const [x, y] = d3.pointer(event, svg.node());
            svg.select("#tooltip")
                .attr("x", x + 10)
                .attr("y", y - 10);
            })
            .on("mouseout", function () {
            // Quitar tooltip
            svg.select("#tooltip").remove();
            })
            .call(
            d3.drag()
                .on("drag", function (event: any, d: Point) {
                d.x = Math.max(0, Math.min(width, event.x));
                d.y = Math.max(0, Math.min(height, event.y));
                setPoints([...points]);
                })
            );
        // Dibujar la pelota
        svg
            .append("circle")
            .attr("r", 6)
            .attr("fill", "#fff")
            .attr("cx", ballPosition[0])
            .attr("cy", ballPosition[1])
            .call(
                d3.drag()
                    .on("drag", function (event: any) {
                        const newX = Math.max(0, Math.min(width, event.x));
                        const newY = Math.max(0, Math.min(height, event.y));
                        setBallPosition([newX, newY]);
                    })
            );
    }, [points, width, height, ballPosition, team1Color, team2Color]);

    let sideScreen = winndowsWidth >= width*1.5;

    return (
        <div
            style={{
                display: "flex",
                flexDirection: sideScreen ? "row" : "column",
                alignItems: "center",
                justifyContent: "center",
                width: sideScreen ? width * 1.5 : width,
                height: sideScreen ? height : height * 1.5,
            }}
            className='voronoi-diagram'
        >
            <svg ref={svgRef} width={width} height={height} style={{ border: "1px solid #ccc" }} />
            <div style={{ marginTop: "10px", marginLeft: sideScreen ? "20px" : "0px"}}>
                <h3>Formaciones</h3>
                <div style={{ display: "flex", gap: "20px" }}>
                    <div>
                        <h4>Equipo 1</h4>
                        <label>
                            Formacion:&nbsp;
                            <br />
                            <select
                                value={selectedFormation1}
                                onChange={e => setSelectedFormation1(e.target.value)}
                            >
                                {formaciones.map((formacion, idx) => (
                                    <option key={idx} value={formacion.name}>{formacion.name}</option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Color:&nbsp;
                            <br />
                            <select
                                value={team1Color}
                                onChange={e => setTeam1Color(e.target.value)}
                            >
                                {optionsColor.map((color, idx) => (
                                    <option key={idx} value={color.value}>{color.name}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <div>
                        <h4>Equipo 2</h4>
                        <label>
                            Formacion:&nbsp;
                            <br />
                            <select
                                value={selectedFormation2}
                                onChange={e => setSelectedFormation2(e.target.value)}
                            >
                                {formaciones.map((formacion, idx) => (
                                    <option key={idx} value={formacion.name}>{formacion.name}</option>
                                ))}
                            </select>
                        </label>
                        <label>
                            Color:&nbsp;
                            <br />
                            <select
                                value={team2Color}
                                onChange={e => setTeam2Color(e.target.value)}
                            >
                                {optionsColor.map((color, idx) => (
                                    <option key={idx} value={color.value}>{color.name}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VoronoiDiagram;
