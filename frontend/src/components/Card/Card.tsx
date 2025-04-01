import React from "react";
import { VaccineIntro }from "../../interfaces/Vaccine";
import "./Card.scss"
import {BlogIntro} from "../../interfaces/Blog.ts";
import {VaccineService} from "../../pages/HomePage/useHomePage.ts";



export const VaccineCard : React.FC<VaccineIntro> = ({id, name, manufacturer, image}) => {
    return(
        <>
            <div className="cardVaccineContainer">
                <img src={image} alt={id} className="cardVaccineImgage"/>
                <div className="cardVaccineTitle">{name} <span>({manufacturer})</span></div>
            </div>
        </>
    );
}

export const ServiceCard : React.FC<VaccineService> = ({id, name, image}) => {
    return(
        <>
            <div key={id} className="cardServiceContainer" style={{ backgroundImage: `url(${image})` }}>
                <div className="contentOverplay"> 
                    <span className="cardServiceTitle">{name}</span>
                </div>
            </div>     
        </>
    );
}
 

export const NewsCard : React.FC<BlogIntro> = ({blogPostId, title, imageUrl,type}) => {
    return(
        <>
            <div key={blogPostId} className="newsContainer">
                <img src={imageUrl} alt={type}  className="cardNewsImg"/>
                <hr className="newsDivider"></hr>
                <h3 className="newsTitle" dangerouslySetInnerHTML={{__html: title}}></h3>
            </div>
        </>
    );
}