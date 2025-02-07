import React from "react";
import { VaccineIntro, VaccineService } from "../../types/Vaccine";
import "./Card.scss"
import { BlogIntro } from "../../types/Decorative";

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
 

export const BlogCard : React.FC<BlogIntro> = ({id, title, briefContent, image}) => {
    return(
        <>
            <div key={id} className="blogContainer">
                <img src={image} alt={id} className="cardBlogImg"/>
                <h3 className="blogTitlte">{title}</h3>
                <hr className="blogDivider"></hr>
                <div className="blogBriefContent">{briefContent}</div>
            </div>
        </>
    );
}