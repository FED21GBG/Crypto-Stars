
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function TakenPhotoPage() {
    let getPhoto = localStorage.getItem('photo')

    const photoRef = useRef(null) 

    const navigate = useNavigate()
// const [photo,setPhoto] = useState<string|null>()
function takeNewPic (){
    navigate('/CameraPage')
}



    useEffect(()=>{
        // setPhoto(getPhoto)
        let photo:any = photoRef.current
        photo.src = getPhoto;
    },[])

    return (
        <section>
            TakenPhotoPage

            <img ref={photoRef}/>

            <button onClick={takeNewPic}>ta e ny bild</button>

            
            
        </section>
    );
}

export default TakenPhotoPage;