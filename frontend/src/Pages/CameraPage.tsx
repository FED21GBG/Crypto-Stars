import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function CameraPage() {
  const navigate = useNavigate()

  const cameraRef = useRef(null);
  const canvasRef = useRef(null);
  const [username, setUsername]= useState('');
  const [photo64, setphoto64]= useState('');

// const checkCanvas = useCallback(()=>{
//   if(canvasRef != null){
//     takePhoto()
//   }
  
// },[canvasRef])

  async function takePhoto()  {
   
    
    const width = 450
    const height = 450
    
    let video = cameraRef.current

    let photo:any = canvasRef.current

        photo.width = width

        photo.height = height

    let context = photo.getContext('2d')

    context.drawImage(video, 0, 0, width, height)

    
    
    let dataUrl = photo.toDataURL()
    // const getBase64StringFromDataURL = (dataURL:string) =>
    // dataURL.replace('data:', '').replace(/^.+,/, '');
    // const base64 = getBase64StringFromDataURL(dataUrl)
    // let imgUrl = dataUrl.replace(/^data:image\/(png|jpg);base64,/, "")

    const userInfo ={
      username:username,
      img:photo64

    }
    userInfo.img= dataUrl

    const response = await fetch('http://localhost:2009/api/addPhoto',{
      method: 'POST',
      body: JSON.stringify(userInfo),
      headers:{'Content-Type': 'application/json'}
    })

    const data = await response.json()

    console.log(data);
console.log(dataUrl);
setphoto64(dataUrl)
localStorage.setItem('photo', dataUrl )

navigate ('/TakenPhotoPage')


  }

  function getUsercamera (){
     navigator.mediaDevices
      .getUserMedia({
        video: true
      })
      .then((stream) => {
        let video:any = cameraRef.current;
        video.srcObject = stream;
        video.play();
      })
      .catch((err) => {
        console.error(err);
      });
    
  }




  
  useEffect(()=>{
    
    const getUsername = localStorage.getItem('username')
    if(typeof getUsername === 'string'){
      setUsername(getUsername)
    }
    getUsercamera();


  },[])

    return ( 
       <section>
        <video style={{width:'350px' }} src="" id="camera" ref={cameraRef}></video>
        <button onClick={()=> takePhoto()}>ta en bild</button>
        <canvas ref={canvasRef}></canvas>
       </section>
     );
}

export default CameraPage;