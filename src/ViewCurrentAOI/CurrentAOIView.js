import React from "react";
import { Button, ButtonGroup, Container, ToggleButton } from "react-bootstrap";
import { useSelector } from "react-redux";
import { WebMercatorViewport } from "react-map-gl";
import bbox from "@turf/bbox";

const CurrentAOIView = ({
  aoiSelected,
  setAoiSelected,
  setViewport,
  setView,
}) => {
  const aoiList = Object.values(useSelector((state) => state.aoi));
  return (
    <Container>
      <h2>Review Current AOIs</h2>
      <ButtonGroup toggle className="mb-2 " vertical style={{ width: "100%" }}>
        {aoiList.length > 0 &&
          aoiList.map((aoi) => (
            <ToggleButton
              key={aoi.id}
              type="radio"
              variant="outline-secondary"
              name={aoi.id}
              value={aoi.id}
              checked={aoiSelected === aoi.id}
              onChange={(e) => {
                setAoiSelected(e.currentTarget.value);
                // Use Turf to get the bounding box of the collections of features
                var aoiBbox = bbox({
                  type: "FeatureCollection",
                  features: aoi.geometry,
                });
                // Format of the bounding box needs to be an array of two opposite corners ([[lon,lat],[lon,lat]])
                var viewportBbox = [
                  [aoiBbox[0], aoiBbox[1]],
                  [aoiBbox[2], aoiBbox[3]],
                ];
                // Use WebMercatorViewport to get center longitude/latitude and zoom level
                var newViewport = new WebMercatorViewport({
                  width: 800,
                  height: 600,
                }).fitBounds(viewportBbox, { padding: 100 });
                // console.log(newViewport);
                setViewport({
                  latitude: newViewport.latitude,
                  longitude:
                    newViewport.longitude - 0.5 * (aoiBbox[2] - aoiBbox[0]),
                  zoom: newViewport.zoom,
                });
              }}
            >
              {aoi.name}
            </ToggleButton>
          ))}
      </ButtonGroup>
      <Container>
        <Button variant="dark" onClick={() => setView("add")}>
          Add More AOIs
        </Button>
        <Button variant="dark" onClick={() => setView("createAssess")}>
          Next
        </Button>
      </Container>
    </Container>
  );
};

export default CurrentAOIView;