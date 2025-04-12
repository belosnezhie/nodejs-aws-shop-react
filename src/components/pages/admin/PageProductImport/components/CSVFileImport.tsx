import React, { useRef } from "react";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import axios, { AxiosError } from "axios";
import { Buffer } from "buffer";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url }: CSVFileImportProps) {
  // Add creds to LS
  const credentials = "belosnezhie:TEST_PASSWORD";
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
        },
      });
      console.log("File to upload: ", file.name);
      console.log("Uploading to: ", response.data);
      const result = await fetch(response.data, {
        method: "PUT",
        body: file,
      });
      console.log("Result: ", result);
      setFile(undefined);
    } catch (error) {
      const restError: AxiosError = error as AxiosError;
      const status = restError.response?.status;
      if (status === 401) {
        alert(`401 HTTP status. Authorization header is not provided`);
      }
      if (status === 403) {
        alert(`403 HTTP status. Invalid credentials, access denied.`);
      }
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
