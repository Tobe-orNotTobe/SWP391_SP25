
import axios from "axios";
import axiosInstance from "../utils/axiosInstance.ts";
import {VaccineDetail} from "../types/Vaccine.ts";

export const apiGetVaccineIntro = async () => {
    const response = await axiosInstance.get("/api/Vaccine/basic");
    if (response.data) {
        return response.data;
    } else {
        return [];
    }
};

export const apiGetVaccineServiceIntro = async () => {
    const response = await axios.get("Vaccine/VaccineService.json");
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
