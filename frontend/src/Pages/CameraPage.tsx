import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isNull } from "util";

function CameraPage() {
  const navigate = useNavigate()

  const cameraRef = useRef(null);
  const canvasRef = useRef(null);
  const [username, setUsername]= useState('');


  async function takePhoto(){
    const userInfo ={
      username: username,
      img:''
    }
    let video = cameraRef.current
    let img:any = canvasRef.current
    img.width = 350
    img.height = 262.5

    let ctx = img.getContext('2d')
    ctx.drawImage(video, 0, 0, img.width, img.height)
    let dataUrl = img.toDataURL('image/png')
    const getBase64StringFromDataURL = (dataURL:string) =>
    dataURL.replace('data:', '').replace(/^.+,/, '');
    const base64 = getBase64StringFromDataURL(dataUrl)
    // let imgUrl = dataUrl.replace(/^data:image\/(png|jpg);base64,/, "")
    userInfo.img= base64
    localStorage.setItem('photo',base64)

    const response = await fetch('http://localhost:2009/api/addPhoto',{
      method: 'POST',
      body: JSON.stringify(userInfo),
      headers:{'Content-Type': 'application/json'}
    })

    const data = await response.json()

    console.log(data);
    

navigate ('/TakenPhotoPage')
    
  }

  function getUsercamera (){
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then ((stream)=>{
      let video:any  = cameraRef.current
      
        video.srcObject= stream
        video.play()
      
     
      // console.log(typeof video);

    })
    .catch((error)=>{
      console.error(`${error}`);
      
      
    })
    
  }
  getUsercamera()


  
  useEffect(()=>{
    
    const getUsername = localStorage.getItem('username')
    if(typeof getUsername === 'string'){
      setUsername(getUsername)
    }

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