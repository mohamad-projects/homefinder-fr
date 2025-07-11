import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

const PanoramaViewer = () => {
    const { realEstateDetails: property } = useSelector((state) => state.auth);

    const images = property?.images?.filter(image => image.type === '360') || [];

    const LARAVEL_BASE_URL = 'http://127.0.0.1:8000/';

    const scenes = useMemo(() => {
        if (images.length === 0) {
            return {};
        }

        const newScenes = {};
        images.forEach((image, index) => {
            const imageUrl = `http://localhost:8000/panorama-image/real-estate/${image.name}`;
            console.log(`Image ${index}:`, image);
            console.log(`Image URL: ${imageUrl}`);

            newScenes[index.toString()] = {
                image: imageUrl,
                label: `360 View ${index + 1}`,
                next: (index + 1 < images.length) ? (index + 1).toString() : '0',
                prev: (index - 1 >= 0) ? (index - 1).toString() : (images.length - 1).toString(),
            };
        });
        return newScenes;
    }, [images]);

    const [currentSceneIndex, setCurrentSceneIndex] = useState(
        images.length > 0 ? '0' : null
    );

    useEffect(() => {
        if (images.length > 0 && currentSceneIndex === null) {
            setCurrentSceneIndex('0');
        }
    }, [images, currentSceneIndex]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            const key = event.key.toLowerCase();
            if (currentSceneIndex !== null && scenes[currentSceneIndex]) {
                if (key === "e") {
                    setCurrentSceneIndex(scenes[currentSceneIndex].next);
                } else if (key === "q") {
                    setCurrentSceneIndex(scenes[currentSceneIndex].prev);
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [currentSceneIndex, scenes]);

    const goToNextScene = () => {
        if (currentSceneIndex !== null) {
            setCurrentSceneIndex(scenes[currentSceneIndex].next);
        }
    };

    const goToPrevScene = () => {
        if (currentSceneIndex !== null) {
            setCurrentSceneIndex(scenes[currentSceneIndex].prev);
        }
    };

    if (!property || images.length === 0 || currentSceneIndex === null) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <p>Loading 360 images or no 360 images available...</p>
            </div>
        );
    }

    const currentScene = scenes[currentSceneIndex];

    if (!currentScene) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <p>Error: Could not load current 360 scene.</p>
            </div>
        );
    }

    return (
        <div style={{ height: "100vh", position: "relative" }}>
            <div
                style={{
                    position: "absolute",
                    top: 20,
                    left: 20,
                    background: "rgba(0, 0, 0, 0.6)",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "10px",
                    fontSize: "18px",
                    zIndex: 1,
                }}
            >
                {currentScene.label}
            </div>

            <div
                style={{
                    position: "absolute",
                    bottom: 20,
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    gap: "20px",
                    zIndex: 1,
                }}
            >
                <button
                    onClick={goToPrevScene}
                    style={{
                        padding: "10px 20px",
                        fontSize: "16px",
                        background: "#0077ff",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "background 0.3s ease",
                    }}
                >
                    Previous View (Q)
                </button>
                <button
                    onClick={goToNextScene}
                    style={{
                        padding: "10px 20px",
                        fontSize: "16px",
                        background: "#0077ff",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        transition: "background 0.3s ease",
                    }}
                >
                    Next View (E)
                </button>
            </div>

            <a-scene key={currentScene.image} embedded vr-mode-ui="enabled: false">
                <a-sky src={currentScene.image} crossorigin="anonymous"></a-sky>
                <a-entity
                    camera
                    look-controls
                    wasd-controls="acceleration: 5000; fly: false"
                    position="0 1.6 0"
                >
                    <a-cursor
                        fuse="false"
                        color="white"
                        raycaster="objects: .clickable"
                    />
                </a-entity>
            </a-scene>
        </div>
    );
};

export default PanoramaViewer;
