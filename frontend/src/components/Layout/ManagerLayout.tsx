import React, {  useState } from "react";
import { Menu, Layout } from "antd";
import { IoHomeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const { Sider } = Layout;

// Định nghĩa kiểu cho props


const ManagerLayout: React.FC = () => {
    const [selectedKey, setSelectedKey] = useState("home");
    const navigate = useNavigate();

    const handleMenuClick = (e: { key: string }) => {
        setSelectedKey(e.key);
        navigate(`/${e.key}`);
    };

    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sider theme="light" width={200}>
                <Menu
                    theme="light"
                    mode="inline"
                    selectedKeys={[selectedKey]}
                    onClick={handleMenuClick}
                >
                    <Menu.Item key="home" icon={<IoHomeOutline />}>
                        Trang Chủ
                    </Menu.Item>
                    <Menu.Item key="home" icon={<IoHomeOutline />}>
                        Danh sách vaccinevaccine
                    </Menu.Item>
                    <Menu.Item key="home" icon={<IoHomeOutline />}>
                        Home
                    </Menu.Item>
                    <Menu.Item key="home" icon={<IoHomeOutline />}>
                        Home
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
               
            </Layout>
        </Layout>
    );
};

export default ManagerLayout;
