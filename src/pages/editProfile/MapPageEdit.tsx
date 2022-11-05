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
  useJsApiLoader,
  useLoadScript,
} from "@react-google-maps/api";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiMap } from "react-icons/fi";
import { REACT_APP_GOOGLE_API_KEY } from "../_app";

const MapPageEdit = ({
  onSaveLocation,
  onSaveAddress,
  location,
  address,
}: any) => {
  const { register: registerMap, setValue: setValueMap } = useForm();

  const theme = useTheme();
  setValueMap("map", address);

  const [position, setPosition] = React.useState(
    location || {
      lan: 0,
      lng: 0,
    }
  );

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

  const { isLoaded, loadError } = useLoadScript({
    id: "script-loader-gps",
    googleMapsApiKey: REACT_APP_GOOGLE_API_KEY as string,
    libraries: ["places"],
  });

  return (
    <Flex h="16.5rem" borderRadius={10} direction={"column"}>
      {isLoaded ? (
        <>
          <StandaloneSearchBox
            onLoad={onLoad}
            onPlacesChanged={onPlacesChanged}
          >
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiMap color={theme.colors.gray["500"]} />
              </InputLeftElement>
              <Input
                {...registerMap("map")}
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
        </>
      ) : (
        <h1>Erro ao carregar mapa</h1>
      )}
    </Flex>
  );
};

export default MapPageEdit;
