import DoctorLayout from "../../components/Layout/StaffLayout/DoctorLayout/DoctorLayout.tsx";
import DoctorBogForm from "./Blog/DoctorBogForm.tsx";


function DoctorBlogPostPage() {
  return (
    <DoctorLayout>
      <DoctorBogForm/>
    </DoctorLayout>
  );
}

export default DoctorBlogPostPage;
