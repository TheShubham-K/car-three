import React, { useEffect, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Mesh } from "three";
import { Html } from "@react-three/drei";

function CarButton({ onToggle, children }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "d" || event.key === "D") {
        onToggle(true);
      } else if (event.key === "c" || event.key === "C") {
        onToggle(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onToggle]);

//   return (
//     <Html>
//       {children}
//     </Html>
//   );
return null;
}

export function Car() {
  const gltf = useLoader(
    GLTFLoader,
    process.env.PUBLIC_URL + "models/car/scene.gltf"
  );

  const [headlightsOn, setHeadlightsOn] = useState(true);

  useEffect(() => {
    gltf.scene.scale.set(0.005, 0.005, 0.005);
    gltf.scene.position.set(0, -0.035, 0);
    gltf.scene.traverse((object) => {
      if (object instanceof Mesh) {
        object.castShadow = true;
        object.receiveShadow = true;
        object.material.envMapIntensity = 10;
      }
    });
  }, [gltf]);

  useFrame((state, delta) => {
    let t = state.clock.getElapsedTime();

    let group = gltf.scene.children[0].children[0].children[0];
    group.children[0].rotation.x = t * 2;
    group.children[2].rotation.x = t * 2;
    group.children[4].rotation.x = t * 2;
    group.children[6].rotation.x = t * 2;

    
  });

  useEffect(() => {
    const toggleHeadlights = (on) => {
      gltf.scene.traverse((object) => {
        if (object.name === "Headlight") {
          object.visible = on;
        }
      });
    };

    toggleHeadlights(headlightsOn);

    return () => toggleHeadlights(false);
  }, [headlightsOn, gltf]);

  return (
    <>
      <primitive object={gltf.scene} />
      <CarButton onToggle={(on) => setHeadlightsOn(on)}>
        Headlights: {headlightsOn ? "On" : "Off"} (Press D/C)
      </CarButton>
    </>
  );
}
