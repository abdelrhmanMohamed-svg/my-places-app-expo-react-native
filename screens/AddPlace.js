import PlaceForm from '../components/places/PlaceForm';
import { insertPlace } from '../util/database';
import { schedulePlaceReminder } from '../util/notifications';

export default function AddPlace({ navigation }) {
  async function createPlaceHandler(place) {
    await insertPlace(place);
    // Reset/schedule inactivity notification reminder
    await schedulePlaceReminder();
    navigation.goBack();
  }

  return <PlaceForm onCreatePlace={createPlaceHandler} />;
}
