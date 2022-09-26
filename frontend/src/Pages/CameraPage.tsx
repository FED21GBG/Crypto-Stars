import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import albumLogo from "../gallery.svg";

function CameraPage() {
  const navigate = useNavigate();

  const cameraRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [username, setUsername] = useState("");
  const [photo64, setphoto64] = useState("");

  async function loggedIn() {
    const token = sessionStorage.getItem("token");
    const response = await fetch("http://localhost:2009/api/loggedin", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    console.log(data);
  }
  loggedIn();

  async function takePhoto() {
    const width = 450;
    const height = 338;

    let video: HTMLVideoElement | null = cameraRef.current;
    let dataUrl = "";

    // fixa any!!
    // I mån om tid, kolla in om det går att lösa med useCallback
    let photo: HTMLCanvasElement | null = canvasRef.current;
    if (photo !== null) {
      photo.width = width;
      photo.height = height;

      let context = photo.getContext("2d");
      if (context !== null && video !== null) {
        context.drawImage(video, 0, 0, width, height);
        dataUrl = photo.toDataURL();
      }
    }

    // const getBase64StringFromDataURL = (dataURL:string) =>
    // dataURL.replace('data:', '').replace(/^.+,/, '');
    // const base64 = getBase64StringFromDataURL(dataUrl)
    // let imgUrl = dataUrl.replace(/^data:image\/(png|jpg);base64,/, "")

    const userInfo = {
      username: username,
      img: photo64,
    };
    userInfo.img = dataUrl;

    const response = await fetch("http://localhost:2009/api/addPhoto", {
      method: "POST",
      body: JSON.stringify(userInfo),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    console.log(data);
    console.log(dataUrl);
    setphoto64(dataUrl);
    localStorage.setItem("photo", dataUrl);

    navigate("/TakenPhotoPage");
  }

  function getUsercamera() {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then((stream) => {
        // I mån om tid, kolla in om det går att lösa med useCallback
        let video = cameraRef.current;
        if (video !== null) {
          video.srcObject = stream;
          video.play();
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(() => {
    const getUsername = localStorage.getItem("username");
    if (typeof getUsername === "string") {
      setUsername(getUsername);
    }
    getUsercamera();
  }, []);

  function logout() {
    navigate("/LoginPage");
    window.localStorage.clear();
    window.sessionStorage.clear();
  }

  return (
    <section className="camera-section">
      <button className="logout-btn" onClick={() => logout()}>
        Logga ut
      </button>
      <img
        className="album-logo"
        src={albumLogo}
        onClick={() => navigate("/PhotoAlbumPage")}
      ></img>
      <video className="camera" src="" id="camera" ref={cameraRef}></video>
      <button className="camera-btn" onClick={() => takePhoto()}>
        FÖREVIGA ETT ÖGONBLICK
      </button>
      <canvas className="canvas" ref={canvasRef}></canvas>
    </section>
  );
}

export default CameraPage;
