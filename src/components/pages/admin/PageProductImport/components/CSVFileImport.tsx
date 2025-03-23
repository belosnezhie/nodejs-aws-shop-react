import React, { useRef } from "react";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import axios from "axios";
import { Buffer } from "buffer";
// import "dotenv/config";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url }: CSVFileImportProps) {
  // const credentials = process.env.CREDENTIALS as string;
  const credentials = "belosnezie=TEST_PASSWORD";
  const encodedCreds = Buffer.from(credentials, "utf-8").toString("base64");
  localStorage.setItem("authorization_token", encodedCreds);

  const authorizationToken = localStorage.getItem("authorization_token") || "";
  console.log("authorizationToken", authorizationToken);

  const [file, setFile] = React.useState<File>();

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const uploadFile = async () => {
    console.log("uploadFile to", url);

    try {
      if (!file) {
        throw new Error("No file selected");
      }
      const response = await axios({
        method: "GET",
        url,
        params: {
          name: encodeURIComponent(file.name),
        },
        headers: {
          Authorization: authorizationToken,
          // test: "test",
        },
      });
      console.log("File to upload: ", file.name);
      console.log("Uploading to: ", response.data);
      // const headers = new Headers();
      // headers.append("Authorization", authorizationToken);
      const result = await fetch(response.data, {
        method: "PUT",
        body: file,
        // headers: {
        //   Authorization: authorizationToken,
        //   // test: "test",
        // },
      });
      console.log("Result: ", result);
      setFile(undefined);
    } catch (error) {
      console.error("There was an error uploading the file", error);
    }
  };

  const uploadInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <Box>
      {file ? (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            size="small"
            color="warning"
            variant="contained"
            onClick={removeFile}
          >
            Remove file
          </Button>
          <Button
            size="small"
            color="secondary"
            variant="contained"
            onClick={uploadFile}
          >
            Upload file
          </Button>
        </div>
      ) : (
        <>
          <input
            hidden
            type="file"
            accept=".csv"
            onChange={onFileChange}
            ref={uploadInputRef}
          />
          <Button
            size="small"
            color="primary"
            variant="contained"
            onClick={() =>
              uploadInputRef.current && uploadInputRef.current.click()
            }
          >
            Import CSV File
          </Button>
        </>
      )}
    </Box>
  );
}
