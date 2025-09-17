import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText } from "lucide-react";

const KycSection = () => {
  const [panFile, setPanFile] = useState(null);
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [salaryFile, setSalaryFile] = useState(null);

  const handleFileUpload = (fileType, file) => {
    switch(fileType) {
      case 'pan':
        setPanFile(file);
        break;
      case 'aadhaar':
        setAadhaarFile(file);
        break;
      case 'salary':
        setSalaryFile(file);
        break;
    }
  };

  const triggerFileInput = (inputId) => {
    document.getElementById(inputId).click();
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
            No KYC Documents Uploaded
          </h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto">
            Please upload your identification documents to complete
            KYC verification and unlock all features.
          </p>

          <div className="space-y-4 text-left">
            {/* PAN Card */}
            <Card className="border-dashed border-gray-600 bg-gray-800/50">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-6 w-6 text-gray-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-200">PAN Card</p>
                    <p className="text-sm text-gray-400">
                      Upload your PAN card for identity verification
                    </p>
                    {panFile && (
                      <p className="text-sm text-emerald-400 mt-1">
                        Selected: {panFile.name}
                      </p>
                    )}
                  </div>
                </div>

                <input
                  type="file"
                  id="pan-upload"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) handleFileUpload('pan', file);
                  }}
                />
                <Button
                  variant="outline"
                  className="border-gray-600 text-black hover:bg-white"
                  onClick={() => triggerFileInput('pan-upload')}
                >
                  Upload PDF
                </Button>
              </CardContent>
            </Card>

            {/* Aadhaar Card */}
            <Card className="border-dashed border-gray-600 bg-gray-800/50">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-6 w-6 text-gray-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-200">Aadhaar Card</p>
                    <p className="text-sm text-gray-400">
                      Upload your Aadhaar card for address verification
                    </p>
                    {aadhaarFile && (
                      <p className="text-sm text-emerald-400 mt-1">
                        Selected: {aadhaarFile.name}
                      </p>
                    )}
                  </div>
                </div>

                <input
                  type="file"
                  id="aadhaar-upload"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) handleFileUpload('aadhaar', file);
                  }}
                />
                <Button
                  variant="outline"
                  className="border-gray-600 text-black hover:bg-white"
                  onClick={() => triggerFileInput('aadhaar-upload')}
                >
                  Upload PDF
                </Button>
              </CardContent>
            </Card>

            {/* Salary Slip */}
            <Card className="border-dashed border-gray-600 bg-gray-800/50">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-6 w-6 text-gray-500 mr-3" />
                  <div>
                    <p className="font-medium text-gray-200">Salary Slip</p>
                    <p className="text-sm text-gray-400">
                      Upload your last 3 months salary slips for income verification
                    </p>
                    {salaryFile && (
                      <p className="text-sm text-emerald-400 mt-1">
                        Selected: {salaryFile.name}
                      </p>
                    )}
                  </div>
                </div>

                <input
                  type="file"
                  id="salary-upload"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) handleFileUpload('salary', file);
                  }}
                />
                <Button
                  variant="outline"
                  className="border-gray-600 text-black hover:bg-white"
                  onClick={() => triggerFileInput('salary-upload')}
                >
                  Upload PDF
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KycSection;