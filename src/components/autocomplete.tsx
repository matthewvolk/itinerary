"use client";

import { Loader } from "@googlemaps/js-api-loader";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
  version: "weekly",
  libraries: ["places"],
});

const Place = ({ place }: { place: google.maps.places.PlaceResult }) => {
  return (
    <div className="flex flex-col">
      <h2>{place.name}</h2>
      <a
        className="text-blue-500 underline underline-offset-4"
        href={place.website}
        rel="noopener noreferrer"
        target="_blank"
      >
        {place.website}
      </a>
      <a
        className="text-blue-500 underline underline-offset-4"
        href={`tel:${place.international_phone_number}`}
      >
        {place.international_phone_number}
      </a>
      <p>{place.formatted_address}</p>
      <p>{place.rating}</p>
      <div className="flex max-h-80 gap-4 overflow-x-scroll overscroll-contain">
        {place.photos &&
          place.photos.map((photo) => (
            <Image
              alt={`${place.name} Image 1`}
              className="rounded-md object-cover"
              height={320}
              key={photo.getUrl()}
              src={photo.getUrl()}
              width={photo.width / 3}
            />
          ))}
      </div>
    </div>
  );
};

export const Autocomplete = () => {
  const autoCompleteRef = useRef(null);
  const [place, setPlace] = useState<null | google.maps.places.PlaceResult>(
    null,
  );

  useEffect(() => {
    const loadPlaces = async () => {
      if (!autoCompleteRef.current) return;

      const { Autocomplete } = await loader.importLibrary("places");
      const autocomplete = new Autocomplete(autoCompleteRef.current);

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        setPlace(place);
      });
    };

    loadPlaces();
  }, [setPlace]);

  return (
    <>
      <input
        autoFocus={true}
        className="border"
        id="autocomplete"
        ref={autoCompleteRef}
        type="text"
      />
      {place && <Place place={place} />}
    </>
  );
};
