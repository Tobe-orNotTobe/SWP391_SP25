import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, notification } from 'antd';
import { apiAddVaccinationSchedule, apiUpdateVaccinationSchedule } from '../../../../apis/apiVaccine';
import { useVaccineDetail } from '../../../../hooks/useVaccine';
import {useVaccinationScheduleDetailById} from "../../../../hooks/useVaccine";
import { VaccinationSchedule, VaccineScheduleDetail } from '../../../../interfaces/Vaccine';


export const useScheduleVaccinationForm = () => {
  const [form] = Form.useForm();
  const { scheduleId } = useParams<{ scheduleId: string }>();
  const navigate = useNavigate();
  const isEditMode = !!scheduleId;
  const [loading, setLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState<VaccinationSchedule | null>(null);

  const { vaccinationScheduleDetail, loading: detailLoading, error } = useVaccinationScheduleDetailById(Number(scheduleId));
  const { vaccineDetail, loading: vaccineLoading } = useVaccineDetail();

  useEffect(() => {
    if (isEditMode && vaccinationScheduleDetail) {
      setFormData(vaccinationScheduleDetail);
      form.setFieldsValue(vaccinationScheduleDetail);
    }
  }, [vaccinationScheduleDetail, isEditMode, form]);

  useEffect(() => {
    if (error) {
      notification.error({
        message: 'Lỗi',
        description: error
      });
    }
  }, [error]);

  const handleSelectVaccine = (value: number, fieldName: number) => {
    const currentDetails = form.getFieldValue('vaccineScheduleDetails') || [];
    const selectedVaccines = currentDetails.map((detail: VaccineScheduleDetail) => detail.vaccineId);

    if (selectedVaccines.includes(value) && currentDetails[fieldName].vaccineId !== value) {
      return;
    }

    const updatedDetails = [...currentDetails];
    updatedDetails[fieldName].vaccineId = value;
    form.setFieldsValue({ vaccineScheduleDetails: updatedDetails });
  };

  const handleSubmit = async (values: VaccinationSchedule) => {
    setLoading(true);
    const response = isEditMode
        ? await apiUpdateVaccinationSchedule(Number(scheduleId), values)
        : await apiAddVaccinationSchedule(values);

    console.log('Response:', response);

    if (response.isSuccess) {
      notification.success({
        message: 'Thành công',
        description: response.message,
      });
      navigate('/manager/schedule-vaccines');
    } else {
      notification.error({
        message: 'Thất bại',
      });
    }
    setLoading(false);
  };

  return {
    navigate,
    formData,
    form,
    isEditMode,
    loading: loading || detailLoading,
    vaccineDetail,
    vaccineLoading,
    handleSelectVaccine,
    handleSubmit,
  };
};
