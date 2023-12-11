import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import Toast from "toastwind";
import "toastwind/dist/style.css";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
const options = {
  cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
  cMapPacked: true,
  // scale: 5, // Adjust the scale for rendering
  renderTextLayer: true, // Enable text smoothing
  renderMode: "canvas", // Use canvas rendering for better quality
};

const PDFViewer = ({ pdfFile }) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [renderedPageNumber, setRenderedPageNumber] = useState(null);
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    let ratio = 0;
    // Load the PDF document using pdf.js
    pdfjs
      .getDocument(pdfFile)
      .promise.then((pdf) => {
        // Get the first page of the PDF
        return pdf.getPage(1);
      })
      .then((page) => {
        // Get the width and height of the page
        const viewport = page.getViewport({ scale: 1 });
        ratio = viewport.width / viewport.height;
        updateDimensions();
      })
      .catch((error) => {});

    const updateDimensions = () => {
      const maxWidth = Math.min(
        window.innerWidth * 0.95,
        (window.innerHeight - 50) * ratio
      );

      const maxHeight = Math.min(
        window.innerHeight - 50,
        (window.innerWidth * 0.95) / ratio
      );

      setWidth(Math.floor(maxWidth));
      setHeight(Math.floor(maxHeight));
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
    // eslint-disable-next-line
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setTimeout(() => {
      setIsShow(true);
    }, 400);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.target.name === "search") {
        return;
      }
      if (event.keyCode === 37) {
        handlePrevPage();
      } else if (event.keyCode === 39) {
        handleNextPage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line
  }, [numPages]);

  const handlePrevPage = () => {
    setPageNumber((prevPageNumber) =>
      prevPageNumber > 1 ? prevPageNumber - 1 : prevPageNumber
    );
  };

  const handleNextPage = () => {
    setPageNumber((prevPageNumber) =>
      prevPageNumber < numPages ? prevPageNumber + 1 : prevPageNumber
    );
  };

  const handleSwipe = (event) => {
    if (event.target.name === "search") {
      return;
    }
    const { clientX: startX, clientY: startY } = event.changedTouches[0];

    const handleSwipeEnd = (e) => {
      const { clientX: endX, clientY: endY } = e.changedTouches[0];
      const deltaX = endX - startX;
      const deltaY = endY - startY;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 10) {
          handlePrevPage();
        } else {
          handleNextPage();
        }
      }
    };

    window.addEventListener("touchend", handleSwipeEnd, { once: true });
  };

  const hankaku = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const zenkaku = ["０", "１", "２", "３", "４", "５", "６", "７", "８", "９"];

  const handleSearch = (param) => {
    let body = searchText;
    if (body === "") {
      Toast.show("問題番号を入力してください。", { status: "error" });
      return;
    }

    for (let i = 0; i < body.length; i++) {
      if (!hankaku.includes(body[i]) && !hankaku.includes(body[i])) {
        Toast.show("問題番号を正しく入力してください。", { status: "error" });
        return true;
      }
    }

    if (param === 1) {
      switch (searchText.length) {
        case 1:
          body = "問題００" + convertToFullWidthNumbers(body);
          break;
        case 2:
          body = "問題０" + convertToFullWidthNumbers(body);
          break;
        default:
          body = "問題" + convertToFullWidthNumbers(body);
          break;
      }
    } else {
      switch (searchText.length) {
        case 1:
          body = "総合０" + convertToFullWidthNumbers(body);
          break;
        default:
          body = "総合" + convertToFullWidthNumbers(body);
          break;
      }
    }

    pdfjs.getDocument(pdfFile).promise.then((pdf) => {
      let pageNumber = 1;

      function processNextPage() {
        if (pageNumber > pdf.numPages) {
          Toast.show("問題番号がありません", { status: "error" });
          return;
        }

        pdf.getPage(pageNumber).then((page) => {
          page.getTextContent().then((content) => {
            const pageText = content.items.map((item) => item.str).join("");

            if (pageText.includes(body)) {
              setPageNumber(pageNumber);
              return; // Exit the recursion once the condition is met
            }

            // Continue to the next page
            pageNumber++;
            processNextPage();
          });
        });
      }

      processNextPage(); // Start the recursive function
    });
  };

  const convertToFullWidthNumbers = (str) => {
    // Replace each half-width number with its corresponding full-width number
    for (let i = 0; i < hankaku.length; i++) {
      const regex = new RegExp(hankaku[i], "g");
      str = str.replace(regex, zenkaku[i]);
    }

    return str;
  };

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
  };

  const isLoading = renderedPageNumber !== pageNumber;

  return (
    <div className="page-center overflow-hidden">
      <div
        style={{
          position: "relative",
          height: `${height - 5}px`,
          overflow: "hidden",
        }}
        onTouchStart={handleSwipe}
        onTouchEnd={handleSwipe}
      >
        <Document
          file={pdfFile}
          onLoadSuccess={onDocumentLoadSuccess}
          options={options}
        >
          {isLoading && renderedPageNumber ? (
            <Page
              key={renderedPageNumber}
              pageNumber={renderedPageNumber}
              scale={1}
              devicePixelRatio={width >= 1024 ? 2.0 : 1.0}
              canvasBackground="#000000"
              width={width}
              // height={height}
              renderAnnotationLayer={false}
            />
          ) : null}
          <Page
            key={pageNumber}
            pageNumber={pageNumber}
            scale={1}
            devicePixelRatio={width >= 1024 ? 2.0 : 1.0}
            canvasBackground="#000000"
            width={width}
            // height={height}
            renderAnnotationLayer={false}
            onRenderSuccess={() => {
              setRenderedPageNumber(pageNumber);
            }}
          />
        </Document>
      </div>
      <div className={`pt-3 w-[${width}px]`}>
        {isShow ? (
          <div className={`flex justify-center w-[${width}]`}>
            <div className="grid grid-flow-col items-center">
              <div>
                <span className="mr-2 text-white">問題番号入力:</span>
                <input
                  type="text"
                  name="search"
                  value={searchText}
                  onChange={handleInputChange}
                  className="rounded-sm p-1 px-2 w-20 mr-2"
                />
              </div>
              <button
                onClick={() => handleSearch(1)}
                className="bg-white px-3 py-1 m-1 rounded-sm hover:bg-gray-200 active:bg-gray-500"
              >
                検索
              </button>
              <button
                onClick={() => handleSearch(2)}
                className="bg-white px-3 py-1 m-1 rounded-sm hover:bg-gray-200 active:bg-gray-500"
              >
                総合問題から検索
              </button>
            </div>
            <div className="absolute right-10 m-2">
              <span className="text-white py-1 px-2">
                ページ {pageNumber} / {numPages}
              </span>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default PDFViewer;
