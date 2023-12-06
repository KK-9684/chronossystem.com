import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import PDFViewer from "../components/PDFViewer";
import { Spinner } from "@material-tailwind/react";
import accessLocal from "../utils/accessLocal";
import axios from "axios";
import { TokenExpiration } from "../utils/TokenExpiration";

const Pviewer = () => {
  const token = useSelector((store) => store.authReducer.token);
  const [file, setFile] = useState("");
  const [progress, setLoadingProgress] = useState(0);

  const source = axios.CancelToken.source();

  useEffect(() => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    };

    const params = {
      problem: accessLocal.loadData("problem"),
      unit: accessLocal.loadData("unit"),
      type: accessLocal.loadData("study"),
    };

    TokenExpiration();
    axios
      .get("/pdf_data", {
        params: params,
        ...config,
        onDownloadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setLoadingProgress(percentCompleted);
        },
        cancelToken: source.token,
      })
      .then((res) => {
        const fileURL = URL.createObjectURL(res.data);
        setFile(fileURL);
      })
      .catch((error) => {});

    return () => {
      source.cancel("Request canceled");
    };
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="bg-black w-full h-[100vh]">
        {file === "" ? (
          <div className="text-white grid grid-flow-row justify-items-center page-center">
            <Spinner className="h-12 w-12" />
            <div>{progress}%</div>
          </div>
        ) : (
          <PDFViewer pdfFile={file} />
        )}
      </div>
    </>
  );
};

export default Pviewer;
