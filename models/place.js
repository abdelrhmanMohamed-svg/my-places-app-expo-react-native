export class Place {
  constructor(title, imageUri, location, id) {
    this.title = title;
    this.imageUri = imageUri;
    this.address = location?.address || '';
    this.location = location ? { lat: location.lat, lng: location.lng } : null;
    this.id = id;
  }
}
