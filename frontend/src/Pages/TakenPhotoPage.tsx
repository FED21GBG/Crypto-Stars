import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import albumLogo from "../gallery.svg";
function TakenPhotoPage() {
  let getPhoto = localStorage.getItem("photo");

  const photoRef = useRef(null);

  const navigate = useNavigate();
  // const [photo,setPhoto] = useState<string|null>()
  function takeNewPic() {
    navigate("/CameraPage");
  }

  useEffect(() => {
    // setPhoto(getPhoto)
    let photo: any = photoRef.current;
    photo.src = getPhoto;
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
