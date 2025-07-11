import React, { useRef, useEffect } from "react";

const AFrameViewer = ({ image }) => {
    const containerRef = useRef(null);
    console.log("hi")
    useEffect(() => {
        if (!image || !containerRef.current) return;

        containerRef.current.innerHTML = "";

        const scene = document.createElement("a-scene");
        scene.setAttribute("embedded", "");
        scene.setAttribute("vr-mode-ui", "enabled: false");

        const sky = document.createElement("a-sky");
        sky.setAttribute("src", image);
        sky.setAttribute("crossorigin", "anonymous");

        const cameraEntity = document.createElement("a-entity");
        cameraEntity.setAttribute("camera", "");
        cameraEntity.setAttribute("look-controls", "");
        cameraEntity.setAttribute("wasd-controls", "acceleration: 5000; fly: false");
        cameraEntity.setAttribute("position", "0 1.6 0");

        const cursor = document.createElement("a-cursor");
        cursor.setAttribute("fuse", "false");
        cursor.setAttribute("color", "white");
        cursor.setAttribute("raycaster", "objects: .clickable");

        cameraEntity.appendChild(cursor);
        scene.appendChild(sky);
        scene.appendChild(cameraEntity);

        containerRef.current.appendChild(scene);
    }, [image]);

    return (
        <div ref={containerRef} style={{ width: "100%", height: "100vh" }} />
    );
};

export default AFrameViewer;
