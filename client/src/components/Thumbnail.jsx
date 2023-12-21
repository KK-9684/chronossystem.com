import React, { useState, useEffect } from "react";

const Thumbnail = ({ param, width, height }) => {
  const [thumbnailLargeUrl, setThumbnailLargeUrl] = useState("");

  useEffect(() => {
    const url = `https://vimeo.com/api/v2/video/${param}.xml`;

    fetch(url)
      .then((response) => response.text())
      .then((xmlData) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlData, "text/xml");
        // Retrieve the thumbnail_large URL
        const thumbnailLargeUrl =
          xmlDoc.querySelector("thumbnail_large").textContent;
        setThumbnailLargeUrl(thumbnailLargeUrl);
      })
      .catch((error) => {});
  }, [param]);

  return (
    <>
      {thumbnailLargeUrl && (
        <img
          src={thumbnailLargeUrl}
          width={width}
          height={height}
          alt="Thumbnail"
          className="rounded"
        />
      )}
    </>
  );
};

export default Thumbnail;
