
import axios from "axios";
import axiosInstance from "../utils/axiosInstance.ts";
import {VaccineDetail} from "../types/Vaccine.ts";

export const apiGetVaccineIntro = async () => {
    try{
        const response = await axios.get("Vaccine/VaccineIntro.json");
        console.log(response)
        return response.data;
    }catch(error){
        console.error("Error fetching data", error);
        return [];
    }
}

export const apiGetVaccineServiceIntro = async () => {
    try{
        const response = await axios.get("Vaccine/VaccineService.json");
        console.log(response)
        return response.data;
    }catch(error){
        console.error(error);
        return [];
    }
}

export const apiGetVaccineDetail = async () => {
    try{
        const response = await axiosInstance.get("/api/Vaccine");
        console.log(response);
        return response.data;
    }catch(error){
        console.error(error)
        return {};
    }
}

export const apiDeleteVaccine = async (id: number) => {
    try {
        const response = await axiosInstance.delete(`/api/Vaccine/${id}`);
        console.log("Deleted vaccine:", response);
        return response.data;
    } catch (error) {
        console.error("Error deleting vaccine:", error);
        throw error;
    }
};

export const apiAddVaccine = async (data : VaccineDetail) => {
    try{
        const response = await axiosInstance.post("/api/Vaccine", data);
        console.log(response)
        return response.data;
    }catch (error){
        console.error("Error deleting vaccine:", error);
        throw error;
    }
}