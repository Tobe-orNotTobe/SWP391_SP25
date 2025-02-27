
import { Form } from 'antd';
import { useNavigate, useParams } from "react-router-dom";
import { useVaccinatonScheduleDetailById } from "../../../../hooks/useVaccine";
import { useEffect, useState } from "react";
import { apiAddVaccinationSchedule, apiUpdateVaccinationSchedule } from "../../../../apis/apiVaccine";
import { VaccinationSchedule } from "../../../../interfaces/Vaccine";


export const useVaccinationScheduleForm = () =>{

    const [form] = Form.useForm();
    const navigate = useNavigate();
    const {id} = useParams();
    
    const [submitting, setSubmitting] = useState(false);


    const isEditMode = Boolean(id);


    const {vaccinationScheduleDetail} = useVaccinatonScheduleDetailById(Number(id))


    useEffect(() => {
        if (isEditMode && vaccinationScheduleDetail) {
          // Format the data to match the form structure
          form.setFieldsValue({
            ageRangeStart: vaccinationScheduleDetail.ageRangeStart,
            ageRangeEnd: vaccinationScheduleDetail.ageRangeEnd,
            notes: vaccinationScheduleDetail.notes,
            vaccineScheduleDetails: vaccinationScheduleDetail.vaccineScheduleDetails.map(detail => ({
              vaccineId: detail.vaccineId,
              injectionSchedules: detail.injectionSchedules
            }))
          });
        }
      }, [vaccinationScheduleDetail, form, isEditMode]);

      const onFinish = async (values: VaccinationSchedule) => {
        try {
          setSubmitting(true);
          
        
          const formattedData: VaccinationSchedule = {
            ...values,
            scheduleId: isEditMode ? Number(id) : 0, 
          };
          
          if (isEditMode) {
            await apiUpdateVaccinationSchedule(Number(id), formattedData);
          } else {
            await apiAddVaccinationSchedule(formattedData);
          }
          
         
          navigate('/manager/schedule-vaccines');
        } catch (error) {
          console.error('Failed to save vaccination schedule:', error);
        } finally {
          setSubmitting(false);
        }
      };
      
      
      const onCancel = () => {
        navigate('/manager/vaccines/schedules');
      };
    
      return {
        form,
        isEditMode,
        submitting,
        onFinish,
        onCancel
      };
}