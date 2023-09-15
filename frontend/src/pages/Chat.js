import React, { useState } from "react";
import Chatbox from "../components/Chatbox";
import { pdfjs } from "react-pdf";
import { Document, Page } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Chat = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [textContent, setTextContent] = useState("");

  const onFileChange = async (e) => {
    const file = await e.target.files[0];
    setPdfFile(file);
    setTextContent("");
    try {
      if (file) {
        const reader = new FileReader();
        reader.onload = async () => {
          const arrayBuffer = await reader.result;
          const pdfData = new Uint8Array(arrayBuffer);

          const pdf = await pdfjs.getDocument({ data: pdfData }).promise;
          await setNumPages(pdf.numPages);

          let pdfText = "";
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const pageText = await page.getTextContent();
            pdfText += pageText.items.map((item) => item.str).join(" ");
          }
          setTextContent(pdfText);

          console.log("PDF text content:", pdfText);
        };
        await reader.readAsArrayBuffer(file);
      } else {
        setTextContent("");
        setPdfFile(null);
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="container mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div className="bg-gray-100 p-4 rounded-lg shadow-md w-auto mb-4 ">
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="file_input">Upload file</label>

        <input
          type="file"
          accept=".pdf"
          onChange={onFileChange}
          className="border border-gray-400 py-2 px-4 rounded-lg mb-0 items-center"
        />
        {pdfFile && (
          <div className="bg-white p-4 rounded-lg w-auto flex  justify-center shadow-md border-gray-900 mb-10">
            <Document
              className="bg-slate-500 h-auto w-auto"
              file={{ url: URL.createObjectURL(pdfFile) }}
            >
              {Array.from(new Array(numPages), (el, index) => (
                <div>
                  <Page
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                    className="h-auto w-auto"
                    style={{
                      width: "20%",
                      height: "100%",
                      margin: "0 auto",
                    }}
                  />
                </div>
              ))}
            </Document>
          </div>
        )}
      </div>
      {textContent && <Chatbox textContent={textContent} />}
    </div>
  );
};

export default Chat;
