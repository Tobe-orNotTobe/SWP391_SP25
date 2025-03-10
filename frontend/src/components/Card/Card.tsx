import React from "react";
import { VaccineIntro }from "../../interfaces/Vaccine";
import "./Card.scss"
import {NewsIntro, VaccineService} from "../../interfaces/Decorative.ts";


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
 

export const NewsCard : React.FC<NewsIntro> = ({id, title, briefContent, image}) => {
    return(
        <>
            <div key={id} className="newsContainer">
                <img src={image} alt={id} className="cardNewsImg"/>
                <hr className="newsDivider"></hr>
                <h3 className="newsTitle" dangerouslySetInnerHTML={{__html: title}}></h3>
                <div className="newsBriefContent">{briefContent}</div>
            </div>
        </>
    );
}