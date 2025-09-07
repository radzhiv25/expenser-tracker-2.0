"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText, CheckCircle, AlertCircle, Download } from "lucide-react";
import { parseCSV, convertToExpense, generateCSVTemplate, CSVExpense } from "@/lib/csv-utils";
import { ExpenseService } from "@/lib/expense-service";
import { AuthService } from "@/lib/auth";

interface CSVUploadProps {
    onUploadComplete: () => void;
}

export function CSVUpload({ onUploadComplete }: CSVUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [previewData, setPreviewData] = useState<CSVExpense[]>([]);
    const [showPreview, setShowPreview] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.name.toLowerCase().endsWith('.csv')) {
            setUploadStatus('error');
            setErrorMessage('Please select a CSV file');
            return;
        }

        try {
            const text = await file.text();
            const csvData = parseCSV(text);

            setPreviewData(csvData);
            setShowPreview(true);
            setUploadStatus('idle');
            setErrorMessage('');
        } catch (error) {
            setUploadStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Failed to parse CSV file');
        }
    };

    const handleUpload = async () => {
        if (previewData.length === 0) return;

        setIsUploading(true);
        setUploadProgress(0);
        setUploadStatus('idle');
        setErrorMessage('');

        try {
            // Get current user
            const user = await AuthService.getCurrentUser();
            if (!user) {
                setUploadStatus('error');
                setErrorMessage('User not authenticated');
                return;
            }

            let successCount = 0;
            let errorCount = 0;

            for (let i = 0; i < previewData.length; i++) {
                try {
                    const expense = convertToExpense(previewData[i], user.$id);
                    await ExpenseService.createExpense(expense);
                    successCount++;
                } catch (error) {
                    console.error(`Failed to create expense ${i + 1}:`, error);
                    errorCount++;
                }

                setUploadProgress(((i + 1) / previewData.length) * 100);
            }

            if (successCount > 0) {
                setUploadStatus('success');
                setSuccessMessage(`Successfully imported ${successCount} expenses${errorCount > 0 ? ` (${errorCount} failed)` : ''}`);
                setShowPreview(false);
                setPreviewData([]);
                onUploadComplete();
            } else {
                setUploadStatus('error');
                setErrorMessage('Failed to import any expenses');
            }
        } catch (error) {
            setUploadStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDownloadTemplate = () => {
        const template = generateCSVTemplate();
        const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');

        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'expenses_template.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const resetUpload = () => {
        setUploadStatus('idle');
        setErrorMessage('');
        setSuccessMessage('');
        setShowPreview(false);
        setPreviewData([]);
        setUploadProgress(0);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Import Expenses from CSV
                </CardTitle>
                <CardDescription>
                    Upload a CSV file to import multiple expenses at once
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Upload Status */}
                {uploadStatus === 'success' && (
                    <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                            {successMessage}
                        </AlertDescription>
                    </Alert>
                )}

                {uploadStatus === 'error' && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            {errorMessage}
                        </AlertDescription>
                    </Alert>
                )}

                {/* File Upload */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                        <Button
                            onClick={() => fileInputRef.current?.click()}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <FileText className="h-4 w-4" />
                            Select CSV File
                        </Button>
                        <Button
                            onClick={handleDownloadTemplate}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <Download className="h-4 w-4" />
                            Download Template
                        </Button>
                    </div>

                    {/* Upload Progress */}
                    {isUploading && (
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Uploading expenses...</span>
                                <span>{Math.round(uploadProgress)}%</span>
                            </div>
                            <Progress value={uploadProgress} className="w-full" />
                        </div>
                    )}

                    {/* Preview Data */}
                    {showPreview && previewData.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium">
                                    Preview ({previewData.length} expenses found)
                                </h4>
                                <Button onClick={resetUpload} variant="outline" size="sm">
                                    Cancel
                                </Button>
                            </div>

                            <div className="max-h-60 overflow-y-auto border rounded-lg">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted">
                                        <tr>
                                            <th className="p-2 text-left">Title</th>
                                            <th className="p-2 text-left">Category</th>
                                            <th className="p-2 text-left">Amount</th>
                                            <th className="p-2 text-left">Currency</th>
                                            <th className="p-2 text-left">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {previewData.slice(0, 10).map((expense, index) => (
                                            <tr key={index} className="border-t">
                                                <td className="p-2">{expense.title}</td>
                                                <td className="p-2">{expense.category}</td>
                                                <td className="p-2">{expense.amount}</td>
                                                <td className="p-2">{expense.currency}</td>
                                                <td className="p-2">{expense.date}</td>
                                            </tr>
                                        ))}
                                        {previewData.length > 10 && (
                                            <tr>
                                                <td colSpan={5} className="p-2 text-center text-muted-foreground">
                                                    ... and {previewData.length - 10} more
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex gap-2">
                                <Button onClick={handleUpload} disabled={isUploading}>
                                    Import {previewData.length} Expenses
                                </Button>
                                <Button onClick={resetUpload} variant="outline">
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Instructions */}
                <div className="text-sm text-muted-foreground space-y-2">
                    <p><strong>CSV Format Requirements:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Required columns: title, category, amount, currency, date</li>
                        <li>Optional column: description</li>
                        <li>Date format: YYYY-MM-DD (e.g., 2024-01-15)</li>
                        <li>Currency: 3-letter code (e.g., USD, EUR, INR)</li>
                        <li>Amount: Positive numbers only</li>
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
}
