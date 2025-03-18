import { jsPDF } from "jspdf";
import { toast } from "react-toastify";
import { BookingResponse } from "../interfaces/VaccineRegistration.ts";

export const exportPDF = (booking: BookingResponse, comboDetails = [], vaccineDetails = []) => {
    if (!booking) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 20;

    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");

    // Title
    const title = "SIDE EFFECT VACCINATION BOOKING DETAILS";
    const titleWidth = (doc.getStringUnitWidth(title) * (doc as any).internal.getFontSize()) / doc.internal.scaleFactor;
    const titleX = (pageWidth - titleWidth) / 2;
    doc.text(title, titleX, yPosition);
    yPosition += 10;

    // Report date
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const today = new Date().toLocaleDateString("en-GB");
    doc.text(`Report Date: ${today}`, 15, yPosition);
    yPosition += 10;

    // Booking details
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("BOOKING INFORMATION", 15, yPosition);
    yPosition += 10;

    doc.setFont("helvetica", "normal");
    const bookingInfo = [
        `Booking ID: ${booking.bookingId}`,
        `Child's Name: ${booking.childName || "No information"}`,
        `Booking Date: ${new Date(booking.bookingDate).toLocaleDateString("en-GB")}`,
        `Vaccination Type: ${booking.bookingType || "No information"}`,
        `Notes: ${booking.note || "No notes"}`,
        `Status: ${booking.status || "No information"}`,
        `Total Price: ${booking.totalPrice?.toLocaleString() || 0} VND`
    ];

    bookingInfo.forEach(text => {
        doc.text(text, 15, yPosition);
        yPosition += 6;
    });

    // Add vaccine details
    if (comboDetails.length) {
        yPosition = addComboVaccineDetails(doc, comboDetails, yPosition);
    }
    if (vaccineDetails.length) {
        yPosition = addSingleVaccineDetails(doc, vaccineDetails, yPosition);
    }

    // Add signature section
    yPosition = addSignatureSection(doc, yPosition);

    // Add footer
    addFooter(doc);

    // Save PDF
    doc.save(`BookingDetail_${booking.bookingId}_${new Date().toISOString().split('T')[0]}.pdf`);
    toast.success("PDF exported successfully!");
};

const addComboVaccineDetails = (doc: jsPDF, comboDetails: any[], yPosition: number) => {
    doc.setFont("helvetica", "bold");
    doc.text("VACCINE COMBO DETAILS", 15, yPosition);
    yPosition += 10;

    comboDetails.forEach((combo, index) => {
        doc.setFont("helvetica", "normal");
        doc.text(`Combo ${index + 1}: ${combo.comboName}`, 20, yPosition);
        yPosition += 6;
        doc.text(`Price: ${combo.totalPrice?.toLocaleString() || 0} VND`, 20, yPosition);
        yPosition += 6;
    });

    return yPosition + 4;
};

const addSingleVaccineDetails = (doc: jsPDF, vaccineDetails: any[], yPosition: number) => {
    doc.setFont("helvetica", "bold");
    doc.text("SINGLE VACCINE DETAILS", 15, yPosition);
    yPosition += 10;


    vaccineDetails.forEach((vaccine, index) => {
        doc.setFont("helvetica", "normal");
        doc.text(`Vaccine ${index + 1}: ${vaccine.name}`, 20, yPosition);
        yPosition += 6;
        doc.text(`Price: ${vaccine.price?.toLocaleString() || 0} VND`, 20, yPosition);
        yPosition += 10;
    });

    return yPosition + 4;
};

const addSignatureSection = (doc: jsPDF, yPosition: number) => {
    doc.setFont("helvetica", "bold");
    doc.text("Customer Signature:", 15, yPosition);
    doc.line(15, yPosition + 5, 80, yPosition + 5);

    doc.text("Date: ........../............/..........", 120, yPosition);
    doc.text("Vaccination Center Representative:", 120, yPosition + 10);
    doc.line(120, yPosition + 15, 190, yPosition + 15);

    return yPosition + 25;
};

const addFooter = (doc: jsPDF) => {
    const pageCount = (doc as any).internal.getNumberOfPages();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`Page ${i} / ${pageCount}`, pageWidth - 30, pageHeight - 10);
        doc.text("© Vaccination Management System", 15, pageHeight - 10);
    }
};