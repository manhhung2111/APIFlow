import SuperHeader from "@layout/header/header.jsx";
import MasterMenu from "@layout/menu/menu.jsx";
import RequestDisplayHeader from "@components/request/display/header.jsx";
import RequestSidebar from "@components/request/sidebar/sidebar.jsx";
import '@components/request/styles/index.scss'
import "./index.scss";
import RequestEditorUrl from "@components/request/display/editor/url.jsx";
import RequestEditorUrlMain from "@components/request/display/editor/main.jsx";
import RequestContextProvider from "@contexts/request.jsx";
import RequestResponse from "@components/request/response/display/display.jsx";

function App() {
    return (
        <RequestContextProvider>
            <SuperHeader/>
            <div id="body">
                <div className={"master-menu-wrapper"}>
                    <MasterMenu />
                </div>
                <div className="master-main-wrapper">
                    <div className="mmw-header">

                    </div>
                    <div className="mmw-main">
                        <div className="rm-main">
                                <div className="request-header">
                                    <RequestDisplayHeader/>
                                </div>
                                <div className="request-main">
                                    <div className="rm-editor">
                                        <RequestEditorUrl />
                                        <RequestEditorUrlMain />
                                    </div>
                                    <div className="rm-response">
                                        <RequestResponse />
                                    </div>
                                </div>

                        </div>
                        <div className="sidebar">
                            <RequestSidebar/>
                        </div>
                    </div>
                </div>
            </div>
        </RequestContextProvider>
    );
}

export default App;
