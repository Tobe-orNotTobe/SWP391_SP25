import React from "react";
import AdminBlog from "../AdminBlog.tsx";

const AdminBlogManagePage: React.FC = () => {
    return(
      <>
          <AdminBlog isActive={true} />
      </>
    );

}

export default AdminBlogManagePage;