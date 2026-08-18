import React, { useState } from 'react';
import { submitAdditionalInformation } from '../../services/paCaseService';
import { uploadCaseDocument } from '../../services/documentService';
import { X, AlertTriangle, Send, Upload, FileText, CheckCircle2, Trash2 } from 'lucide-react';

interface RFIResponseModalProps {
  caseId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const RFIResponseModal: React.FC<RFIResponseModalProps> = ({
  caseId,
  onClose,
  onSuccess,
}) => {
  const [responseText, setResponseText] = useState(
    'Attaching supplemental documentation of 8 weeks completed physical therapy at Peak Motion (including attendance logs and progress notes) as well as the prior plain lumbar radiograph report from 2026-05-02.'
  );
  const [attachments, setAttachments] = useState<string[]>([
    'PT_Comprehensive_8Week_Log.pdf',
    'Lumbar_XRay_Radiology_Report.pdf',
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        await uploadCaseDocument(caseId, file);
        setAttachments((prev) => Array.from(new Set([...prev, file.name])));
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await submitAdditionalInformation(caseId, responseText, attachments);
      onSuccess();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full flex flex-col overflow-hidden animate-in fade-in zoom-in duration-150">
        {/* Header */}
        <div className="p-5 bg-amber-50/80 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
              <AlertTriangle size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900">Respond to RFI Request</h2>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                  {caseId}
                </span>
              </div>
              <p className="text-[11px] text-amber-800">
                Submit supplemental clinical evidence to fulfill LCD L34220 coverage criteria
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {/* Reviewer Note Context */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
              Reviewer Request Summary
            </span>
            <p className="text-slate-600 leading-relaxed">
              "Reviewer requested documentation of 6 weeks of conservative therapy and prior lumbar plain radiograph (X-Ray) report per LCD L34220."
            </p>
          </div>

          {/* Response Text */}
          <div className="space-y-1.5">
            <label className="input-label">Provider Clinical Response &amp; Clarifications</label>
            <textarea
              rows={4}
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              required
              className="input-base leading-relaxed"
              placeholder="Detail how the requested clinical documentation satisfies policy requirements..."
            />
          </div>

          {/* Attachments Section */}
          <div className="space-y-2">
            <label className="input-label">Attach Supplemental Documentation</label>
            <label className="border border-dashed border-slate-300 hover:border-indigo-500 rounded-xl p-4 flex items-center justify-center gap-2 cursor-pointer bg-slate-50 hover:bg-indigo-50/20 transition-colors">
              <Upload size={16} className="text-indigo-600" />
              <span className="font-semibold text-slate-700">Upload PDF / Imaging Report</span>
              <input
                type="file"
                multiple
                accept=".pdf,.txt,.json,.png,.jpg"
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                disabled={uploading}
              />
            </label>

            {attachments.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {attachments.map((name, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <FileText size={14} className="text-indigo-600" />
                      <span className="font-semibold text-slate-800">{name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAttachments((prev) => prev.filter((_, idx) => idx !== i))}
                      className="text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || uploading}
              className="btn-primary bg-amber-600 hover:bg-amber-700"
            >
              <Send size={15} />
              <span>{submitting ? 'Submitting...' : 'Submit RFI Response'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
