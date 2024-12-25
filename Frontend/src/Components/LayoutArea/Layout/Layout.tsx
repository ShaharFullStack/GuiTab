import { useState } from "react";
import { Header } from "../Header/Header";
import { Menu } from "../Menu/Menu";
import { Routing } from "../Routing/Routing";
import "./Layout.css";

export function Layout(): JSX.Element {
    const [year] = useState(new Date().getFullYear());
    return (
        <div className="Layout">
            <header>
                <div className="header-content">
                    <Header />
                    <Menu />
                </div>
            </header>
            <main>
                <Routing />
            </main>
            <footer>
                <p>&copy; {year}. All rights reserved.</p>
            </footer>
        </div>

    );
}
