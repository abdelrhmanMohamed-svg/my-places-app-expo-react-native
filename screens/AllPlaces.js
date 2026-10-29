import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import PlacesList from '../components/places/PlacesList';
import { fetchPlaces } from '../util/database';

export default function AllPlaces() {
  const [loadedPlaces, setLoadedPlaces] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    async function loadPlaces() {
      if (isFocused) {
        const places = await fetchPlaces();
        setLoadedPlaces(places);
      }
    }

    loadPlaces();
  }, [isFocused]);

  return <PlacesList places={loadedPlaces} />;
}
