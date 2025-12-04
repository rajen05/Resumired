import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Download, FileText, Loader2 } from 'lucide-react';
import { exportToPDF, exportToDOCX } from '../../utils/exportUtils';

export function ExportToolbar() {
    const [exporting, setExporting] = useState(null);

    const handlePDF = async () => {
        setExporting('pdf');
        try {
            await exportToPDF();
        } finally {
            setExporting(null);
        }
    };

    const handleDOCX = async () => {
        setExporting('docx');
        try {
            await exportToDOCX();
        } finally {
            setExporting(null);
        }
    };

    return (
        <div className="flex gap-2">
            <Button
                onClick={handlePDF}
                disabled={exporting !== null}
                className="gap-2"
                style={{ display: 'flex', alignItems: 'center' }}
            >
                {exporting === 'pdf' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <Download className="h-4 w-4" />
                )}
                <span>PDF</span>
            </Button>
            <Button
                onClick={handleDOCX}
                variant="outline"
                disabled={exporting !== null}
                className="gap-2"
                style={{ display: 'flex', alignItems: 'center' }}
            >
                {exporting === 'docx' ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <FileText className="h-4 w-4" />
                )}
                <span>DOCX</span>
            </Button>
        </div>
    );
}
