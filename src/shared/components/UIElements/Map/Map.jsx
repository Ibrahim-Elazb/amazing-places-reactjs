// @ts-nocheck
import { useEffect, useRef } from "react";
import "./Map.css";

const Map = (props) => {
  const mapContainer = useRef();
  const {center,zoom}=props;
  useEffect(()=>{
    const map = new window.google.maps.Map(mapContainer.current, {
        center: center,
        zoom: zoom,
      });
      new window.google.maps.Marker({
        position: center,
        map: map,
      });
  },[center, zoom])
  
  return (
    <div
      ref={mapContainer}
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  );
};

export default Map;
