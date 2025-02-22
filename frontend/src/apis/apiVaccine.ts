
import axiosInstance from "../utils/axiosInstance.ts";
import {PostVaccineComboDetail, VaccineDetail} from "../interfaces/Vaccine.ts";


export const apiGetVaccineIntro = async () => {
    const response = await axiosInstance.get("/api/Vaccine/basic");
    if (response.data) {
        return response.data;
    } else {
        return [];
    }
};


export const apiGetVaccineDetailById = async (id: number) => {
    const response = await axiosInstance.get(`/api/Vaccine/${id}`);
    if (response.data) {
        return response.data;
    } else {
        return {};
    }
};

export const apiGetVaccineDetail = async () => {
    const response = await axiosInstance.get("/api/Vaccine");
    if (response.data) {
        return response.data;
    } else {
        return {};
    }
};

export const apiDeleteVaccine = async (id: number) => {
    const response = await axiosInstance.delete(`/api/Vaccine/${id}`);
    if (response.data) {
        return response.data;
    } else {
        return {};
    }
};

export const apiAddVaccine = async (data: VaccineDetail) => {
    const response = await axiosInstance.post("/api/Vaccine", data);
    if (response.data) {
        return response.data;
    } else {
        return {};
    }
};

export const apiUpdateVaccine = async (id: string, data: VaccineDetail) => {
    const response = await axiosInstance.put(`/api/Vaccine/${id}`, data);
    if (response.data) {
        return response.data;
    } else {
        return {};
    }
};

export const apiGetComboVaccineDetail = async () => {
    const response = await axiosInstance.get("/api/ComboVaccine");
    if (response.data) {
        return response.data
    } else {
        return {};
    }
}

export const apiAddComboVaccine = async (data : PostVaccineComboDetail) => {
    const response = await axiosInstance.post("/api/ComboVaccine", data);
    if (response.data){
        return response.data;
    } else {
        return {};
    }
}

export const apiUpdateComboVaccine = async (id: number, data : PostVaccineComboDetail) => {
    const response = await axiosInstance.put(`/api/ComboVaccine/${id}`, data);
    if (response.data) {
        return (response.data);
    } else {
        return {};
    }
}

export const apiDeleteComboVaccine = async (id: number) => {
    const response = await axiosInstance.delete(`/api/ComboVaccine/${id}`);
    if(response.data){
        return response.data;
    }else{
        return {};
    }
}

export const apiGetComBoVaccineById = async (id: number) => {
    const response = await axiosInstance.get(`/api/ComboVaccine/${id}`);
    if(response.data){
        return response.data;
    }else{
        return {};
    }
}