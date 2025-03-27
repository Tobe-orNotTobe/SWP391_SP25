import DoctorLayout from "../../components/Layout/StaffLayout/DoctorLayout/DoctorLayout.tsx";
import DoctorBlogForm from "./Blog/DoctorBogForm.tsx";


function DoctorBlogPostPage() {
  return (
    <DoctorLayout>
      <DoctorBlogForm/>
    </DoctorLayout>
  );
}

export default DoctorBlogPostPage;
