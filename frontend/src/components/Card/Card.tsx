import React from "react";
import { VaccineIntro, VaccineService } from "../../types/Decorative";
import "./Card.scss"

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
                <div className="contentOverplay"> {/* Sửa lại tên class */}
                    <span className="cardServiceTitle">{name}</span>
                </div>
            </div>     
        </>
    );
}
 