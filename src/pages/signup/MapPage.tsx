import {
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  useTheme,
} from "@chakra-ui/react";
import {
  GoogleMap,
  LoadScript,
  StandaloneSearchBox,
  MarkerF,
} from "@react-google-maps/api";
import React from "react";
import { FiMap } from "react-icons/fi";
import { REACT_APP_GOOGLE_API_KEY } from "../_app";

const MapPage = ({ onSaveLocation, onSaveAddress }: any) => {
  const theme = useTheme();

  const [position, setPosition] = React.useState({
    lat: -29.17365527454849,
    lng: -51.21886980105756,
  });

  const [map, setMap] = React.useState<google.maps.Map>();
  const [searchBox, setSearchBox] =
    React.useState<google.maps.places.SearchBox>();

  const onMapLoad = (map: google.maps.Map) => {
    setMap(map);
  };

  const onLoad = (ref: google.maps.places.SearchBox) => {
    setSearchBox(ref);
  };

  const onPlacesChanged = () => {
    try {
      const places = searchBox!.getPlaces();
      const place = places![0];
      const location = {
        lat: place?.geometry?.location?.lat() || 0,
        lng: place?.geometry?.location?.lng() || 0,
      };

      map?.panTo(location);
      setPosition(location);

      onSaveLocation(location);
      onSaveAddress(place?.formatted_address);
    } catch (error) {
      console.log("err", error);
      onSaveLocation({
        lat: 0,
        lng: 0,
      });
      onSaveAddress("");
    }
  };

  return (
    <Flex h="16.5rem" borderRadius={10} direction={"column"}>
      <LoadScript
        googleMapsApiKey={REACT_APP_GOOGLE_API_KEY as string}
        libraries={["places"]}
      >
        <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={onPlacesChanged}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <FiMap color={theme.colors.gray["500"]} />
            </InputLeftElement>
            <Input
              name="map"
              placeholder="Map"
              marginBottom="1rem"
              borderColor="gray.700"
              backgroundColor="gray.700"
              color="gray.100"
              isRequired
            />
          </InputGroup>
        </StandaloneSearchBox>
        <GoogleMap
          onLoad={onMapLoad}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          center={position}
          zoom={15}
        >
          <MarkerF position={position} />
        </GoogleMap>
      </LoadScript>
    </Flex>
  );
};

export default MapPage;
