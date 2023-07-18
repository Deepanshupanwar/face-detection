import './App.css';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import Imagelinkform from './components/Imagelinkform/Imagelinkform';
import Face_Recognition from './components/Face_Recognition/Face_Recognition';
import Rank from './components/Rank/Rank';
import 'tachyons';
import React, { useState, useCallback } from "react";
import Particles from "react-particles";
import { loadFull } from "tsparticles";

const particlesoption={
    fpsLimit: 60,
    interactivity: {
        events: {
            onClick: {
                enable: true,mode: "push",
            },
            onHover: {
                enable: true,mode: "repulse",
            },
            resize: true,
        },
        modes: {
            push: {
                quantity: 4,
            },
            repulse: {
                distance: 200,duration: 0.4,
            },
        },
    },
    particles: {
        color: {
            value: "#ffffff",
        },
        links: {
            color: "#ffffff",distance: 150,enable: true,opacity: 0.5,width: 1,
        },
        collisions: {
            enable: true,
        },
        move: {
            directions: "none",
            enable: true,
            outModes: {
                default: "bounce",
            },
            random: false,speed: 1,straight: false,
        },
        number: {
            density: {
                enable: true,area: 800,
            },
            value: 80,
        },
        opacity: {
            value: 0.5,
        },
        shape: {
            type: "circle",
        },
        size: {
            value: { min: 1, max: 5 },
        },
    },
    detectRetina: true,blur:5
}

function App() {
  const [input, setInput] = useState('');
  const [boxes,setBoxes]= useState([]);
  const [route,setRoute]= useState('signin'); 
  const [issignedin,setissignedin]= useState(false);
  const [user,setuser]=useState({
            id:'',
            name:'',
            email:'',
            entires: 0,
            joined: ''
  })


  const onInputChange = (event) => {
    setInput(event.target.value);
    console.log(input);
  }

 
 const loaduser =(data) =>{
            user.id=data.id;
            user.name=data.name;
            user.email=data.email;
            user.entires= data.entires;
            user.joined= data.joined;
    console.log(data);
    console.log(user);
 }
  
 const onButtonSubmit=()=>{
    
const calculateFaceLocation =(data)=>{
    const image= document.getElementById('inputimage');
    const width=Number(image.width);
    const height=Number(image.height);
    return {
        leftCol: data.left_col * width,
        topRow: data.top_row * height,
        rightCol: width - (data.right_col * width),
        bottomRow: height - (data.bottom_row * height)
    }
}

const dispalyfacebox=(boxx)=>{
    setBoxes(boxx);
}
// URL of image to use. Change this to your image.
const IMAGE_URL = input;

const raw = JSON.stringify({
  "user_app_id": {
    "user_id": "6d8kge4gfk57",
    "app_id": "my-first-application"
  },
  "inputs": [
      {
          "data": {
              "image": {
                  "url": IMAGE_URL
              }
          }
      }
  ]
});

const requestOptions = {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + '8824b24084fd4b6fa35edd9be0c7ce72'
    },
    body: raw
};

// NOTE: MODEL_VERSION_ID is optional, you can also call prediction with the MODEL_ID only
// https://api.clarifai.com/v2/models/{YOUR_MODEL_ID}/outputs
// this will default to the latest version_id

fetch(`https://api.clarifai.com/v2/models/face-detection/versions/6dc7e46bc9124c5c8824be4822abe105/outputs`, requestOptions)
    .then(output => output.json())
    .then(result =>{
        if(result){
            fetch('http://localhost:3000/image',{
                method: 'put',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({
                id:user.id
                } )
            }).then(response=> response.json())
            .then(count =>{
                const updateduser={...user,entires:count};
                setuser(updateduser);
                console.log(updateduser.entires);
            })
        }
        var tempboxes = []
        result.outputs[0].data.regions.forEach((region)=>{
            tempboxes.push(calculateFaceLocation(region.region_info.bounding_box))
        })
        dispalyfacebox(tempboxes)
    } )
    .catch(error => console.log('error', error));
  
 }
  const onRouteChange=(route)=>{
    if(route==='signout')
    {
        setissignedin(false);
        setInput('');
        setuser({});
    }
    else if(route==='home')
    {
        setissignedin(true);
    }
    setRoute(route)
  }
  const particlesInit = useCallback(async engine => {
    //console.log(engine);
    await loadFull(engine);
  }, []);
  const particlesLoaded = useCallback(async container => {
    await console.log(container); 
  }, []);

  return (
    <div className="App">
      <Particles className='particles' id="tsparticles" init={particlesInit} loaded={particlesLoaded} options={particlesoption}/>
      <Navigation issignedin={issignedin} onRouteChange={onRouteChange}/>
      {route==='home'?
        <div>
        <Logo />
        <Rank
            name={user.name}
            entires={user.entires}
         />
        <Imagelinkform onInputChange={onInputChange} onButtonSubmit={onButtonSubmit} />
        <Face_Recognition boxes={boxes} ImageUrl={input}/>
        </div>
        :(route==='signin'
        ?<Signin loaduser={loaduser} onRouteChange={onRouteChange}/>
        :<Register loaduser={loaduser} onRouteChange={onRouteChange}/>
         )
        }
      </div>
  );
}

export default App;
