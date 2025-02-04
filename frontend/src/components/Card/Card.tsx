import React from "react";
import { VaccineIntro } from "../../types/Decorative";
import "./Card.scss"

export const VaccineCard : React.FC<VaccineIntro> = ({id, name, image}) => {
    return(
        <>
            <div className="cardContainer">
                <img src={image} alt={id} className="cardImgage"/>
                <div className="cardTitle">{name}</div>
            </div>
        </>
    );
}