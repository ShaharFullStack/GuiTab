import { Navigate, Route, Routes } from "react-router-dom";
import { TabsList } from "../../DataArea/TabsList/TabsList";
import { Home } from "../../PagesArea/Home/Home";
import { Page404 } from "../Page404/Page404";
import "./Routing.css";
import { TabViewer } from "../../DataArea/TabViewer/TabViewer";
import About from "../../PagesArea/About/About";

export function Routing(): JSX.Element {

    return (
        <div className="Routing">
            <Routes>
                <Route path="/" element={<Navigate to="/home" />} />

                <Route path="/home" element={<Home />} />

                <Route path="/search" element={<TabsList />} />
                
                <Route path="/view" element={<TabViewer fileUrl={""} />} />

                <Route path="/about" element={<About />} />

                <Route path="*" element={<Page404 />} />
            </Routes>
        </div>
    );
}
