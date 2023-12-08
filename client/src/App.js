import React, { useEffect, useState } from "react";
import Router from "./routes/Routers";
import PwaModal from "./components/PwaModal";
import "./App.css";

let offlineState = false;

function App() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [data, setData] = useState({ title: "", message: "" });

  const isOnline = navigator.onLine;
  if (!isOnline) {
    offlineState = true;
  }

  useEffect(() => {
    // Event listener for the online event
    const handleOnline = () => {
      setData({
        title: "オンライン",
        message: "あなたは現在オンラインです!",
      });
    };

    // Event listener for the offline event
    const handleOffline = () => {
      offlineState = true;
      setData({
        title: "オフライン",
        message: "あなたは現在オフラインです!",
      });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (data.title === "オンライン") {
      if (!offlineState) {
        return;
      }
      setModalIsOpen(true);
      setTimeout(() => {
        setModalIsOpen(false);
      }, 3000);
    } else if (data.title === "オフライン") {
      setModalIsOpen(true);
      setTimeout(() => {
        setModalIsOpen(false);
      }, 3000);
    }
  }, [data.title]);

  const okModal = () => {
    window.location.reload();
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <main>
      <Router></Router>
      <PwaModal
        modalIsOpen={modalIsOpen}
        data={data}
        closeModal={closeModal}
        okModal={okModal}
      ></PwaModal>
    </main>
  );
}

export default App;
