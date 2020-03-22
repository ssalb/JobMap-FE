import React from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import userLocationIcon from "./user-location.svg";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";

const mapStyle = {
  position: "absolute",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0
};

const locIcon = L.icon({
  iconUrl: userLocationIcon,
  iconSize: [37.5, 61.5]
});

export default class AppMap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      myPosition: {
        lat: 48.541134,
        lon: 12.124257
      },
      ts: 12345678,
      gotPosition: false,
      zoom: 5,
      gotObjects: false,
      currentObjects: ""
    };
  }

  componentDidMount() {
    fetch("http://localhost:5000/get-current-objects", {
      method: "POST",
      mode: "cors",
      headers: new Headers({
        "content-type": "application/json"
      }),
      body: JSON.stringify({
        target: "workerpool",
        competencies: "feld, pflege",
        radius_km: "5",
        location: [this.state.myPosition.lat, this.state.myPosition.lon]
      })
    })
      .then(r => r.json())
      .then(data => {
        this.setState({
          currentObjects: data.elements,
          gotObjects: true
        });
      });

    navigator.geolocation.getCurrentPosition(coords => {
      this.setState({
        position: {
          lat: coords.coords.latitude,
          lon: coords.coords.longitude
        },
        ts: coords.timestamp,
        gotPosition: true,
        zoom: 16
      });
    });
  }

  render() {
    const position = [this.state.myPosition.lat, this.state.myPosition.lon];
    return (
      <div id="map">
        <Map style={mapStyle} center={position} zoom={this.state.zoom}>
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
            attribution="Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community"
          />
          {this.state.gotObjects && this.state.gotPosition
            ? this.state.currentObjects.map(obj => (
                <Marker key={obj.text} position={obj.position} icon={locIcon}>
                  <Popup>
                    <p>{obj.text}</p>
                  </Popup>
                </Marker>
              ))
            : ""}
        </Map>
      </div>
    );
  }
}
