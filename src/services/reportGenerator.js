import { jsPDF } from "jspdf";
import "jspdf-autotable";

export const generateIncidentReport = (sos) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header - SENTINEL Branding
  doc.setFillColor(13, 13, 13); // Dark BG
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  doc.setTextColor(239, 68, 68); // Primary Red
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("SENTINEL", 20, 25);
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text("OFFICIAL INCIDENT REPORT", pageWidth - 80, 25);

  // Body Content
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.text(`Report ID: ${sos.sosId}`, 20, 50);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 55);

  // Table of SOS Details
  const tableData = [
    ["Emergency Type", sos.type],
    ["Status", sos.status],
    ["Raised By", sos.raisedBy?.name || "Unknown"],
    ["Patient Room/Location", sos.raisedBy?.roomNumber || "N/A"],
    ["Floor", sos.raisedBy?.floor || "N/A"],
    ["Timestamp", new Date(sos.timestamp).toLocaleString()],
    ["Resolution Time", sos.resolvedAt ? `${Math.floor((sos.resolvedAt - sos.timestamp) / 60000)} mins` : "Ongoing"]
  ];

  doc.autoTable({
    startY: 65,
    head: [['Field', 'Details']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [239, 68, 68] },
    styles: { fontSize: 10 }
  });

  // Responder Information
  if (sos.acceptedBy) {
    const responderY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Responder Verification", 20, responderY);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${sos.acceptedBy.name}`, 20, responderY + 10);
    doc.text(`Role: ${sos.acceptedBy.profession}`, 20, responderY + 15);
    doc.text(`Response Started: ${new Date(sos.acceptedTimestamp).toLocaleTimeString()}`, 20, responderY + 20);
  }

  // AI Insights Placeholder (if available)
  if (sos.aiAnalysis) {
    const aiY = (sos.acceptedBy ? doc.lastAutoTable.finalY + 45 : doc.lastAutoTable.finalY + 15);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("SENTINEL AI Insights", 20, aiY);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    const splitText = doc.splitTextToSize(sos.aiAnalysis.recommendedAction || "Standard emergency protocol followed.", pageWidth - 40);
    doc.text(splitText, 20, aiY + 10);
  }

  // Footer
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("CONFIDENTIAL - FOR INTERNAL USE ONLY", pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
  }

  // Save the PDF
  doc.save(`SENTINEL_Report_${sos.sosId}.pdf`);
};
