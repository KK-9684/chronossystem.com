import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Problem from "../pages/Problem";
import Vplayer from "../pages/Vplayer";
import Unit from "../pages/Unit";
import List from "../pages/List";
import Study from "../pages/Study";
import Pviewer from "../pages/Pviewer";
import Chat from "../pages/Chat";
import Layout from "../pages/Layout";
import Manage from "../pages/Manage";
import Muser from "../pages/Muser";
import Mvideo from "../pages/Mvideo";
import Mpdf from "../pages/Mpdf";
import Certification from "../utils/Certification.js";
import AutoLogin from "../utils/AutoLogin.js";
import Forget from "../pages/Forget";
import Reset from "../pages/Reset";
import NotFound from "../pages/NotFound"

const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<AutoLogin><Login /></AutoLogin>} />
            <Route path="/forget" element={<Forget />} />
            <Route path="/reset/:key" element={<Reset />} />
            <Route path="/" element={<Layout />}>
                <Route path="/home" element={<Certification><Home /></Certification>} />
                <Route path="/vproblem" element={<Certification><Problem /></Certification>} />
                <Route path="/vproblem/unit" element={<Certification><Unit /></Certification>} />
                <Route path="/vproblem/unit/list" element={<Certification><List /></Certification>} />
                <Route path="/vproblem/unit/list/video_player" element={<Certification><Vplayer /></Certification>} />
                <Route path="/pproblem" element={<Certification><Problem /></Certification>} />
                <Route path="/pproblem/unit" element={<Certification><Unit /></Certification>} />
                <Route path="/pproblem/unit/study" element={<Certification><Study /></Certification>} />
                <Route path="/pproblem/unit/study/pdf_viewer" element={<Certification><Pviewer /></Certification>} />
                <Route path="/chat" element={<Certification><Chat /></Certification>} />
            </Route>
            <Route path="/" element={<Certification><Manage /></Certification>}>
                <Route path="muser" element={<Muser />} />
                <Route path="mvideo" element={<Mvideo />} />
                <Route path="mpdf" element={<Mpdf />} />
                <Route path="mchat" element={<Chat />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default Router;
