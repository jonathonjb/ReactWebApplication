import React from 'react';
import '../Stylesheets/Home.css';
import SelfPhoto from "../Images/photo.jpg"
import CodePhoto from "../Images/CodeScreenshot.jpg"

function Home() {
  return (
    <div className="Home">
      <div className="container">
        <br />
        <h1 className="text-center">Jonathon Brandt</h1>
        <br/><br/>
        <div className="row">
            <img className="curved_images col-md-2 offset-2 img-fluid" id="self_photo" src={SelfPhoto} alt="Jonathon Brandt" />
            <p className="col-md-4 offset-2">
                Hey readers, welcome to my page. I'm a Computer Science student at Rochester Instituate of Technology, and I created this page to show off 
                some of the projects I have been working on. You can look at some of my projects by clicking on the 'Projects' tab at the top.
            </p>
        </div>
        <br/><br/>
        <div className="row">
            <p className="col-md-4 offset-1">
                By the way, I created a chess engine for fun the other day. You can play against this engine by clicking on the 'Chess' tab. It's not the stongest
                chess engine out there, but it is fairly tough to defeat. Are you strong enough to defeat this mighty engine? Try it out!
            </p>
            <img className="col-md-4 curved_images offset-1 img-fluid" src={CodePhoto} alt="Code" />
        </div>
      </div>
    </div>
  );
}

export default Home;
