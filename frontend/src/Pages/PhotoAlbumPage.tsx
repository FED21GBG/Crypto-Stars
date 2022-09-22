import { get } from "https";
import { useEffect, useState } from "react";

function PhotoAlbumPage() {
  const user = localStorage.getItem("username");
  const [pictures, setPictures] = useState([]);

  async function getAlbum() {
    const reqObj = {
      username: user,
    };
    const response = await fetch("http://localhost:2009/api/getalbum", {
      method: "POST",
      body: JSON.stringify(reqObj),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    console.log(data);
    if (data.success === true) {
      setPictures(data.allImages);
    }
  }

  useEffect(() => {
    getAlbum();
  }, []);

  async function deletePhoto(pic: string) {
    const reqObj = {
      user: user,
      img: pic,
    };
    const response = await fetch("http://localhost:2009/api/deletephoto", {
      method: "DELETE",
      body: JSON.stringify(reqObj),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    if (data.success === true) {
      getAlbum();
    }
  }

  return (
    <section>
      PhotoAlbumPage
      {pictures.map((pic: string, i) => (
        <article key={i}>
          <img src={pic}></img>
          <button onClick={() => deletePhoto(pic)}>Ta bort bild</button>
        </article>
      ))}
    </section>
  );
}

export default PhotoAlbumPage;
