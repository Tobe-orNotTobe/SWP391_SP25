import React from "react";
import AdminBlog from "../AdminBlog.tsx";

const AdminBlogDeactivePage: React.FC = () => {
    return(
        <>
            <AdminBlog isActive={false} />
        </>
    );

}

export default AdminBlogDeactivePage;