import React, { useState } from 'react';
import { uploadCaseDocument } from '../../services/documentService';
import { DocumentUploadResponse } from '../../types/case';
import { Upload, FileText, CheckCircle2, Sparkles, Trash2, Eye } from 'lucide-react';

interface StepDocumentUploadProps {
  attachments: string[];
  setAttachments: React.Dispatch<React.SetStateAction<string[]>>;
  cptCode?: string;
  icd10Code?: string;
}

export const StepDocumentUpload: React.FC<StepDocumentUploadProps> = ({
  attachments,
  setAttachments,
  cptCode = '72148',
  icd10Code = 'M54.16',
}) => {
  const [uploading, setUploading] = useState(false);
  const [analyzedDocs, setAnalyzedDocs] = useState<DocumentUploadResponse[]>([]);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const res = await uploadCaseDocument('PA-INTAKE-TEMP', file, cptCode, icd10Code);
        setAnalyzedDocs((prev) => [...prev, res]);
        setAttachments((prev) => Array.from(new Set([...prev, file.name])));
      }
    } finally {
      setUploading(false);
    }
  };

  const removeAttachment = (filename: string) => {
    setAttachments((prev) => prev.filter((a) => a !== filename));
    setAnalyzedDocs((prev) => prev.filter((d) => d.filename !== filename));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Step 5: Attach Evidence &amp; Supporting Records</h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Upload clinical progress notes, physical therapy discharge summaries, prior X-ray reports, or FHIR JSON bundles.
        </p>
      </div>

      {/* Drag and Drop Zone */}
      <label className="border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/20 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition-all">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
          <Upload size={24} />
        </div>
        <div>
          <span className="font-bold text-slate-900 text-sm">
            Click to upload or drag files here
          </span>
          <p className="text-xs text-slate-500 mt-1">
            Supported formats: PDF, TXT, DICOM, or FHIR JSON (Max 25MB)
          </p>
        </div>
        <input
          type="file"
          multiple
          accept=".pdf,.txt,.json,.png,.jpg,.jpeg"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          disabled={uploading}
        />
        {uploading && (
          <div className="text-xs font-semibold text-indigo-600 flex items-center gap-2">
            <Sparkles size={14} className="animate-spin" />
            <span>Scanning and analyzing document entities...</span>
          </div>
        )}
      </label>

      {/* Uploaded Documents & Extracted OCR Entities */}
      {analyzedDocs.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Uploaded Evidence ({analyzedDocs.length})
          </h3>

          <div className="space-y-3">
            {analyzedDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-subtle space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <FileText size={18} />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{doc.filename}</div>
                      <div className="text-[10px] text-slate-400">
                        {doc.document_type} &bull; {(doc.file_size_bytes / 1024).toFixed(1)} KB &bull; Uploaded {new Date(doc.uploaded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 size={11} /> OCR Processed
                    </span>
                    <button
                      onClick={() => removeAttachment(doc.filename)}
                      className="text-slate-400 hover:text-rose-600 p-1.5 rounded transition-colors"
                      title="Remove file"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Extracted Entities */}
                {doc.ocr_extracted_entities && doc.ocr_extracted_entities.length > 0 && (
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs space-y-1.5">
                    <div className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                      <Sparkles size={11} className="text-indigo-600" />
                      <span>Extracted Clinical Concepts</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {doc.ocr_extracted_entities.map((ent, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-white text-slate-700 rounded border border-slate-200 text-[11px] font-mono"
                        >
                          <strong className="text-indigo-700">{ent.entity_type}:</strong> {ent.text} ({(ent.confidence * 100).toFixed(0)}%)
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
