import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import Toast from "toastwind";
import "toastwind/dist/style.css";
import { jwtDecode } from "jwt-decode";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import saveAs from "file-saver";
import { TokenExpiration } from "../utils/TokenExpiration";

let count = 0;
let memberChanged = false;
let selectedMember = "";

// const socket = io("http://localhost:5000", {
//   transports: ["xhr-polling", "polling"],
//   reconnection: true,
//   reconnectionDelay: 1000,
//   reconnectionDelayMax: 5000,
//   reconnectionAttempts: 5,
// });

const socket = io("https://www.chronossystem.com", {
  path: "/api/socket.io",
  transports: ["xhr-polling", "polling"],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
});

function Chat() {
  const token = useSelector((store) => store.authReducer.token);
  const decodedToken = jwtDecode(token);
  const level = decodedToken.level;
  const name = decodedToken.name;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [isList, setIsList] = useState(false);
  const scrollContainerRef = useRef(null);
  const [prevScrollHeight, setPrevScrollHeight] = useState(0);
  const [isLoadingMoreData, setIsLoadingMoreData] = useState(false);
  const scrollContainer = scrollContainerRef.current;

  useEffect(() => {
    TokenExpiration();
    socket.on("connect", () => {
      socket.emit("register", { username: name, level: level });
    });

    socket.on("register", (data) => {
      if (!data) {
        Toast.show("チャットサーバーへの接続がエラーになる。", {
          status: "success",
        });
      }
    });

    socket.on("chat message", (data) => {
      if (level === "user") {
        if (data.receiver === name || data.sender === name) {
          setMessages((prevMessages) => [...prevMessages, data]);
        }
        // if (level !== "user" && selectedMember === "") {
        //   return;
        // }
      } else {
        if (data.receiver === "クロノス事務局") {
          if (selectedMember === data.sender) {
            setMessages((prevMessages) => [...prevMessages, data]);
          }
        } else if (data.sender === name) {
          setMessages((prevMessages) => [...prevMessages, data]);
        }
      }
    });

    if (level === "user") {
      socket.emit("more data", { name: name, count: count });
    }

    socket.on("more data", (data) => {
      if (level === "user") {
        const reverseData = data.messages.reverse();
        setMessages((prevMessages) => reverseData.concat(prevMessages));
      } else {
        if (data.name === selectedMember) {
          const reverseData = data.messages.reverse();
          if (memberChanged) {
            setMessages(reverseData);
            memberChanged = false;
          } else {
            setMessages((prevMessages) => reverseData.concat(prevMessages));
          }
        }
      }
    });

    if (level !== "user") {
      socket.emit("user list");
    }

    socket.on("user list", (data) => {
      if (data) {
        setMembers(data);
      }
    });

    return () => {
      socket.off("register");
      socket.off("chat message");
      socket.off("more data");
      socket.off("user list");
      selectedMember = "";
      count = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    if (messages.length === 0) {
      return;
    }

    if (isLoadingMoreData) {
      setTimeout(() => {
        const newScrollPosition =
          scrollContainer.scrollHeight - prevScrollHeight;
        scrollContainer.scrollTo({ top: newScrollPosition - 200 });
        setPrevScrollHeight(scrollContainer.scrollHeight);
        setIsLoadingMoreData(false);
      }, 500);
      return;
    }
    setTimeout(() => {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }, 250);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    const handleScroll = () => {
      if (scrollContainer.scrollTop === 0 && !isLoadingMoreData) {
        setIsLoadingMoreData(true);
        count = count + 10;
        TokenExpiration();
        socket.emit("more data", {
          name: level === "user" ? name : selectedMember,
          count: count,
        });
      }
    };
    setPrevScrollHeight(scrollContainer.scrollHeight);
    scrollContainer.addEventListener("scroll", handleScroll);
    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingMoreData]);

  const handleKeyDown = (e) => {};

  const sendMessage = async () => {
    TokenExpiration();

    if (message !== "") {
      if (level !== "user" && selectedMember === "") {
        Toast.show("受信機を選択してください。", { status: "error" });
        return;
      }

      if (file && file.type !== "image/jpeg" && file.type !== "image/png") {
        Toast.show("JPGやPNGファイルのみ転送できます。", { status: "error" });
        return;
      }

      // Check file size
      const maxSizeInBytes = 2 * 1024 * 1024; // 1MB
      if (file && file.size > maxSizeInBytes) {
        Toast.show("ファイルサイズは2MB以下である必要があります。", { status: "error" });
        return;
      }

      if (file) {
        const imageBuffer = await fileToArrayBuffer(file);
        const chunkSize = 64 * 1024; // 64 KB
        const totalChunks = Math.ceil(imageBuffer.byteLength / chunkSize);
        const messagedata = {
          data: { sender: name,
            level: level,
            receiver: level === "user" ? "クロノス事務局" : selectedMember,
            message: message,
          },
          totalChunks,
        };
        for (let i = 0; i < totalChunks; i++) {
          const start = i * chunkSize;
          const end = Math.min(start + chunkSize, imageBuffer.byteLength);
          const chunk = imageBuffer.slice(start, end);
          messagedata.chunkIndex = i;
          socket.emit('image chat message', chunk, messagedata);
        }
      } else {        
        socket.emit("chat message", {
          sender: name,
          level: level,
          receiver: level === "user" ? "クロノス事務局" : selectedMember,
          message: message,
          image: "",
        });
      }

      setMessage("");
      fileInputRef.current.value = null;
      setFile(null);
    } else {
      Toast.show("メッセージをご入力下さい。", { status: "error" });
    }
  };

  const handleMemberChange = (memberName) => {
    if (window.innerWidth < 1024) {
      setIsList((prev) => !prev);
    }
    if (selectedMember !== memberName) {
      memberChanged = true;
      selectedMember = memberName;
      count = 0;
      setPrevScrollHeight(0);
      TokenExpiration();
      socket.emit("more data", {
        name: level === "user" ? name : selectedMember,
        count: count,
      });
    }
  };

  const handleListBar = () => {
    setIsList((prev) => !prev);
  };

  const handleDownload = (image, sender) => {
    const url = `https://www.chronossystem.com/xxs/${image}`;
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        // Generate a unique filename for the downloaded image (optional)
        const filename = `${sender}_image.jpg`;

        // Save the Blob object as a file using the FileSaver.js library
        saveAs(blob, filename);
      })
      .catch((error) => {});
  };

  const getImage = (name) => {
    // return require(`../assets/imgs/${name}`);
    return `https://www.chronossystem.com/xxs/${name}`;
  };

  const fileInputRef = useRef(null);

  const openFileSystem = () => {
    fileInputRef.current.click();
  };

  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    if (event.target.files.length !== 0) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
    }
  };

  const handlefileClose = () => {
    setFile(null);
  };

  const convertDate = (dateTimeString) => {
    const japanTimeZone = "Asia/Tokyo";
    const dateTime = new Date(dateTimeString);
    const formattedDate = dateTime.toLocaleDateString("en-US", {
      timeZone: japanTimeZone,
    });
    const formattedTime = dateTime.toLocaleTimeString("en-US", {
      timeZone: japanTimeZone,
    });
    const arr = formattedDate.split("/");
    const year = arr[2];
    const month = arr[0];
    const day = arr[1];
    return `${year}-${month}-${day} ${formattedTime}`;
  };

  const fileToArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = () => {
        resolve(reader.result);
      };
  
      reader.onerror = (error) => {
        reject(error);
      };
  
      reader.readAsArrayBuffer(file);
    });
  };

  const [width, setWidth] = useState(0);

  useEffect(() => {
    const updateDimensions = () => {
      const maxWidth = window.innerWidth;
      setWidth(Math.floor(maxWidth));
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <div
        className={`${
          level !== "user" ? "-mt-[60px]" : ""
        } grid grid-flow-row justify-center bg-gradient-to-b from-[#0EA5E9] w-[100vw] h-[100vh] z-10 pointer-events-none`}
      >
        <div className="p-10 pt-[60px] grid grid-flow-col items-center">
          {level === "user" ? (
            ""
          ) : width < 1024 ? (
            <div>
              <div
                className={`${
                  window.innerHeight > 1000 ? "h-[67vh]" : "h-[62vh]"
                } w-[300px] bg-white shadow-xl overflow-y-auto px-3 py-5 rounded-2xl mr-10 pointer-events-auto absolute top-16 ${
                  isList ? "" : "hidden"
                }`}
              >
                {members.map((member, index) => {
                  return (
                    <div
                      key={index}
                      className={`${
                        member._id === selectedMember
                          ? "bg-cyan-300"
                          : "bg-gray-200"
                      } text-gray-900 cursor-pointer hover:bg-cyan-200 p-1 rounded mb-1`}
                      onClick={() => handleMemberChange(member._id)}
                    >
                      <i className="fa fa-user mr-1"></i>
                      <span className="">{member._id}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div
              className={`${
                window.innerHeight > 1000 ? "h-[74vh]" : "h-[69vh]"
              } w-[300px] bg-white shadow-xl overflow-y-auto px-3 py-5 rounded-2xl mr-10 pointer-events-auto`}
            >
              {members.map((member, index) => {
                return (
                  <div
                    key={index}
                    className={`${
                      member._id === selectedMember
                        ? "bg-cyan-300"
                        : "bg-gray-200"
                    } text-gray-900 cursor-pointer hover:bg-cyan-200 p-1 rounded mb-1`}
                    onClick={() => handleMemberChange(member._id)}
                  >
                    <i className="fa fa-user mr-1"></i>
                    <span className="">{member._id}</span>
                  </div>
                );
              })}
            </div>
          )}
          <div className="w-[650px] pointer-events-auto">
            <div
              ref={scrollContainerRef}
              className={`${
                window.innerHeight > 1000 ? "h-[70vh]" : "h-[64vh]"
              } overflow-y-auto overflow-x-hidden pb-10 px-7 scroll-container`}
            >
              {level === "user"
                ? messages.map((msg, index) =>
                    msg.level === "user" ? (
                      <div key={index}>
                        <div className="justify-self-end grid grid-flow-col items-end justify-end">
                          <div className="text-md text-white float-right mb-2 mr-2">
                            {convertDate(msg.created)}
                          </div>
                          <div className="bg-[#00D34D] p-[15px] my-2 rounded-2xl">
                            <div className="text-base font-bold text-right">
                              {msg.sender}
                            </div>
                            <div className="max-w-[350px] break-words whitespace-pre-wrap">
                              <span>{msg.message}</span>
                            </div>
                          </div>
                        </div>
                        {msg.image === "" ? (
                          ""
                        ) : (
                          <div className="grid justify-items-end grid-flow-col justify-end items-end">
                            <button
                              onClick={() =>
                                handleDownload(msg.image, msg.sender)
                              }
                            >
                              <i className="fa fa-download text-cblue hover:text-indigo-700 m-1"></i>
                            </button>
                            <Zoom classDialog={"custom-zoom"}>
                              <img
                                src={getImage(msg.image)}
                                className="max-w-[350px] rounded-2xl"
                                alt={msg.sender}
                              />
                            </Zoom>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div key={index}>
                        <div className="justify-self-start grid grid-flow-col items-end justify-start">
                          <div className="bg-white p-[15px] my-2 rounded-2xl">
                            <div className="text-base font-bold">
                              クロノス事務局
                            </div>
                            <div className="max-w-[350px] break-words whitespace-pre-wrap">
                              <span>{msg.message}</span>
                            </div>
                          </div>
                          <div className="text-md text-white float-left mb-2 ml-2">
                            {convertDate(msg.created)}
                          </div>
                        </div>
                        {msg.image === "" ? (
                          ""
                        ) : (
                          <div className="grid justify-items-start grid-flow-col justify-start items-end">
                            <Zoom zoomMargin={60} classDialog={"custom-zoom"}>
                              <img
                                src={getImage(msg.image)}
                                className="max-w-[350px] rounded-2xl"
                                alt={msg.sender}
                              />
                            </Zoom>
                            <button
                              onClick={() =>
                                handleDownload(msg.image, msg.sender)
                              }
                            >
                              <i className="fa fa-download text-cblue hover:text-indigo-700 m-1"></i>
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  )
                : messages.map((msg, index) =>
                    msg.level === "manager" || msg.level === "master" ? (
                      <div key={index}>
                        <div className="justify-self-end grid grid-flow-col items-end justify-end">
                          <div className="text-md text-white float-right mb-2 mr-2">
                            {convertDate(msg.created)}
                          </div>
                          <div className="bg-[#00D34D] p-[15px] my-2 rounded-2xl">
                            <div className="text-base font-bold text-right">
                              クロノス事務局
                            </div>
                            <div className="max-w-[350px] break-words whitespace-pre-wrap">
                              <span>{msg.message}</span>
                            </div>
                          </div>
                        </div>
                        {msg.image === "" ? (
                          ""
                        ) : (
                          <div className="grid justify-items-end grid-flow-col justify-end items-end">
                            <button
                              onClick={() =>
                                handleDownload(msg.image, msg.sender)
                              }
                            >
                              <i className="fa fa-download text-cblue hover:text-indigo-700 m-1"></i>
                            </button>
                            <Zoom zoomMargin={60} classDialog={"custom-zoom"}>
                              <img
                                src={getImage(msg.image)}
                                className="max-w-[350px] float-right rounded-2xl"
                                alt={msg.sender}
                              />
                            </Zoom>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div key={index}>
                        <div className="justify-self-start grid grid-flow-col items-end justify-start">
                          <div className="bg-white p-[15px] my-2 rounded-2xl">
                            <div className="text-base font-bold">
                              {msg.sender}
                            </div>
                            <div className="max-w-[350px] break-words whitespace-pre-wrap">
                              <span>{msg.message}</span>
                            </div>
                          </div>
                          <div className="text-md text-white float-left mb-2 ml-2">
                            {convertDate(msg.created)}
                          </div>
                        </div>
                        {msg.image === "" ? (
                          ""
                        ) : (
                          <div className="grid justify-items-start grid-flow-col justify-start items-end">
                            <Zoom zoomMargin={60} classDialog={"custom-zoom"}>
                              <img
                                src={getImage(msg.image)}
                                className="max-w-[350px] rounded-2xl"
                                alt={msg.sender}
                              />
                            </Zoom>
                            <button
                              onClick={() =>
                                handleDownload(msg.image, msg.sender)
                              }
                            >
                              <i className="fa fa-download text-cblue hover:text-indigo-700 m-1"></i>
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  )}
            </div>
            <div className="mt-5">
              {level !== "user" && window.innerWidth < 1024 ? (
                <button
                  className="float-left ml-1 text-cblue"
                  onClick={() => handleListBar()}
                >
                  <i className="fa fa-bars"></i>
                </button>
              ) : (
                ""
              )}
              <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                accept="image/png, image/jpeg"
                onChange={handleFileChange}
              />
              <button
                onClick={sendMessage}
                className="float-right text-white py-1 px-3 m-1 text-lg hover:bg-blue-300 bg-cblue rounded"
              >
                送信
              </button>
              <button
                onClick={openFileSystem}
                className="float-right m-1 text-white py-1 px-3 text-lg hover:bg-blue-300 bg-cblue rounded"
              >
                写真を添付
              </button>
              <button
                className={`${
                  file ? "" : "hidden"
                } float-right mr-2 text-red-600 text-lg mt-2`}
                onClick={handlefileClose}
              >
                <i className="fa-solid fa-close"></i>
              </button>
              <input
                type="text"
                className="float-right mr-3 text-cblue bg-transparent text-right w-[400px] text-lg mt-2"
                disabled
                value={file ? file.name : ""}
              />
              <textarea
                className="h-[125px] rounded-xl p-3 w-full border-cblue border-2"
                value={message}
                placeholder="メッセージを入力"
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
