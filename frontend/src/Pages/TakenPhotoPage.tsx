import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import albumLogo from "../gallery.svg";


function TakenPhotoPage() {
  let getPhoto = localStorage.getItem("photo");

  const photoRef = useRef<HTMLImageElement>(null);

  const navigate = useNavigate();
 
  function takeNewPic() {
    navigate("/CameraPage");
  }

  useEffect(() => {
    //hämtar bilden from localStorage och lägger in den i src
    let photo: HTMLImageElement | null = photoRef.current;
    if(photo !== null && getPhoto !== null){
    photo.src = getPhoto;
  }
  }, []);

  return (
    <section className="camera-section">
      <img
        className="album-logo"
        src={albumLogo}
        onClick={() => navigate("/PhotoAlbumPage")}
      ></img>
      <img className="camera" ref={photoRef} />
      <button className="camera-btn" onClick={takeNewPic}>
        FÅNGA ETT NYTT ÖGONBLICK
      </button>
    </section>
  );
}

export default TakenPhotoPage;
