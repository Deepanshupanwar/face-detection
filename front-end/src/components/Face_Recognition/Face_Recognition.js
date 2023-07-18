import React,{useEffect,useState} from "react";
import './Face_Recognition.css'
const Face_Recognition =({ImageUrl,boxes}) =>{
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  console.log("inside",ImageUrl);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
    var temp = (window.innerWidth -500)/2
    return (
        
        <div className='absoulte mt2'>
            <img id='inputimage' alt='' src={ImageUrl} width='500px' heigh='auto'/>
            {
                boxes.map(box=>{
                    return <div className='bounding-box' style={{top: box.topRow, right: temp+box.rightCol, bottom: box.bottomRow, left: temp+box.leftCol}}></div>
                })
            }
        </div>
    );
}
export default Face_Recognition;