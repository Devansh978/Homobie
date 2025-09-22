import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Download, Trash2 } from "lucide-react";

const KycSection = ({ baseUrl = "https://api.homobie.com" }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  const authToken = localStorage.getItem("auth_token");
  const userId = localStorage.getItem("userId");

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/document/get/${userId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      const mapped = data.map((doc) => ({
        id: doc.fileId,
        name: doc.fileName,
        status: doc.status,
      }));
      setDocuments(mapped);
    } catch (err) {
      console.error("Error fetching files:", err);
    } finally {
      setLoading(false);
    }
  };
const updateDocumentStatus = async (fileId, status) => {
  try {
    const res = await fetch(`${baseUrl}/document/update/${fileId}?status=${status}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      setDocuments((docs) =>
        docs.map((doc) =>
          doc.id === fileId ? { ...doc, status } : doc
        )
      );
      console.log("Status updated successfully");
    } else {
      const error = await res.text();
      console.error("Failed to update status:", error);
    }
  } catch (err) {
    console.error("Error updating status:", err);
  }
};


  const uploadFile = async (fileType, file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId);
      formData.append("type", fileType);
      formData.append("status", "pending");

      const res = await fetch(`${baseUrl}/document/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
        body: formData,
      });

      if (res.ok) {
        setTimeout(fetchFiles, 500);
      } else {
        console.error("Upload failed", await res.text());
      }
    } catch (err) {
      console.error("Error uploading file:", err);
    }
  };

  const downloadFile = async (fileId) => {
    try {
      const res = await fetch(`${baseUrl}/document/download/${fileId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileId}.pdf`;
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error downloading:", err);
    }
  };

  const getDownloadUrl = async (fileId) => {
    try {
      const res = await fetch(`${baseUrl}/document/download-url/${fileId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      console.log("Presigned URL:", data);
      return data?.url;
    } catch (err) {
      console.error("Error getting download URL:", err);
    }
  };

  const deleteFile = async (fileId) => {
    try {
      const res = await fetch(`${baseUrl}/document/delete/${fileId}/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (res.ok) {
        setDocuments((docs) => docs.filter((doc) => doc.id !== fileId));
        console.log("File deleted successfully");
      } else {
        const error = await res.text();
        console.error("Delete failed:", error);
      }
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const triggerFileInput = (inputId) => {
    document.getElementById(inputId).click();
  };

  const handleFileSelect = (fileType, e) => {
    const file = e.target.files[0];
    if (file) uploadFile(fileType, file);
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-100">KYC Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-6">
          <Upload className="mx-auto h-12 w-12 text-gray-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-200 mb-2">
            Upload Your KYC Documents
          </h3>

          <div className="space-y-4 text-left">
            {["pan", "aadhaar", "salary"].map((type) => (
              <Card
                key={type}
                className="border-dashed border-gray-600 bg-gray-800/50"
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-6 w-6 text-gray-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-200">
                        {type === "pan"
                          ? "PAN Card"
                          : type === "aadhaar"
                          ? "Aadhaar Card"
                          : "Salary Slip"}
                      </p>
                      <p className="text-sm text-gray-400">
                        {type === "pan" &&
                          "Upload your PAN card for identity verification"}
                        {type === "aadhaar" &&
                          "Upload your Aadhaar card for address verification"}
                        {type === "salary" &&
                          "Upload last 3 months salary slips"}
                      </p>
                    </div>
                  </div>

                  <input
                    type="file"
                    id={`${type}-upload`}
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) => handleFileSelect(type, e)}
                  />
                  <Button
                    variant="outline"
                    className="border-gray-600 text-black hover:bg-white"
                    onClick={() => triggerFileInput(`${type}-upload`)}
                  >
                    Upload PDF
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6">
            <h4 className="text-gray-200 font-medium mb-3">Uploaded Files</h4>
            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : documents.length === 0 ? (
              <p className="text-gray-400">No files uploaded yet.</p>
            ) : (
              <ul className="space-y-3">
                {documents.map((doc) => (
                  <li key={doc.id} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                    <span className="text-gray-200">{doc.name}</span>
                    <div className="flex gap-2 items-center">
                      <select
                        value={doc.status}
                        onChange={(e) => updateDocumentStatus(doc.id, e.target.value)}
                        className="bg-gray-600 text-white p-1 rounded"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <Button
                        size="sm"
                        onClick={() => downloadFile(doc.id)}
                        className="bg-blue-600 hover:bg-blue-500 text-white"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => deleteFile(doc.id)}
                        className="bg-red-600 hover:bg-red-500 text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KycSection;
