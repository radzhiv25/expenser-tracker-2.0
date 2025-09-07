"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CSVUpload } from "./csv-upload";
import { CSVDownload } from "./csv-download";
import { Upload, Download } from "lucide-react";
import { Expense } from "@/lib/expense-service";

interface CSVManagerProps {
    expenses: Expense[];
    onUploadComplete: () => void;
}

export function CSVManager({ expenses, onUploadComplete }: CSVManagerProps) {
    return (
        <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Import CSV
                </TabsTrigger>
                <TabsTrigger value="download" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export CSV
                </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-6">
                <CSVUpload onUploadComplete={onUploadComplete} />
            </TabsContent>

            <TabsContent value="download" className="mt-6">
                <CSVDownload expenses={expenses} />
            </TabsContent>
        </Tabs>
    );
}
