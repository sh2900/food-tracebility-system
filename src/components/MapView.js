import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
const customIcon = new L.Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function MapView({ lat, lng }) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={10}
      style={{ height: "300px", width: "100%", borderRadius: "10px" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[lat, lng]} icon={customIcon}>
        <Popup>Current Location</Popup>
      </Marker>
    </MapContainer>
  );
}

export default MapView;