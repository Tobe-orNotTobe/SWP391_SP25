import jsPDF from 'jspdf';
import { toast } from "react-toastify";
import moment from 'moment';

// Extend the jsPDF type to include the autotable plugin
declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: any) => jsPDF;
    }
}

export const exportPDF = (booking: any, vaccineRecordDetails: any) => {
    try {
        // Create a new PDF document
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('VACCINATION BOOKING DETAILS', 105, 20, { align: 'center' });

        // Add the clinic information
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('SIDE EFFECT', 105, 30, { align: 'center' });
        doc.setFontSize(10);
        doc.text('Address: Lot E2a-7, Road D1, High-Tech Park, Long Thanh My Ward, Thu Duc City, Ho Chi Minh City.', 105, 35, { align: 'center' });
        doc.text('Hotline: 091222 4434 - Email: childvaccinesystem25@gmail.com', 105, 40, { align: 'center' });

        // Add booking information
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('BOOKING INFORMATION', 20, 50);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);

        // Create an array of information to display
        const bookingInfo = [
            ['ID:', booking.bookingId?.toString() || ''],
            ['Child Name:', booking.childName || ''],
            ['Booking Date:', moment(booking.bookingDate).format("MM/DD/YYYY") || ''],
            ['Vaccination Type:', booking.bookingType || ''],
            ['Notes:', booking.notes || 'None'],
            ['Status:', getStatusTextInEnglish(booking.status) || '']
        ];

        // Display booking information
        let y = 55;
        bookingInfo.forEach(info => {
            doc.setFont('helvetica', 'bold');
            doc.text(info[0], 20, y);
            doc.setFont('helvetica', 'normal');
            doc.text(info[1], 70, y);
            y += 7;
        });

        // Add vaccine details if available
        if (booking.bookingDetails && booking.bookingDetails.length > 0) {
            y += 5;
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('VACCINE DETAILS', 20, y);
            y += 10;

            booking.bookingDetails.forEach((vaccineItem: any) => {
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.text(`Vaccine Name: ${vaccineItem.vaccineName || ''}`, 20, y);
                y += 7;
                doc.text(`Injection Date: ${moment(vaccineItem.injectionDate).format("MM/DD/YYYY") || ''}`, 20, y);
                y += 7;
                doc.text(`Price: ${(vaccineItem.price || 0).toLocaleString()} VND`, 20, y);
                y += 10;
            });
        }

        // Add vaccine record details if available
        if (booking.status === "Completed" && vaccineRecordDetails && vaccineRecordDetails.result && vaccineRecordDetails.result.vaccineRecords) {
            y += 5;
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('VACCINE RECORD DETAILS', 20, y);
            y += 10;

            const records = vaccineRecordDetails.result.vaccineRecords;

            // Create a manual table without autoTable
            if (records.length > 0) {
                // Define table headers
                const headers = [
                    'Vaccine Name',
                    'Dose',
                    'Price',
                    'Next Dose Date',
                    'Batch No.',
                    'Status',
                    'Notes'
                ];

                // Draw table headers
                doc.setFontSize(8);
                doc.setFont('helvetica', 'bold');

                // Define column positions
                const colPositions = [20, 60, 80, 105, 130, 150, 170];
                const rowHeight = 8;

                // Draw header row
                headers.forEach((header, index) => {
                    doc.text(header, colPositions[index], y);
                });

                y += rowHeight;
                doc.setFont('helvetica', 'normal');

                // Draw horizontal line after headers
                doc.line(20, y - rowHeight / 2, 190, y - rowHeight / 2);

                // Draw data rows
                records.forEach((record: any) => {
                    // Check if we need a new page
                    if (y > 260) {
                        doc.addPage();
                        y = 20;
                    }

                    doc.text(record.vaccineName || '', colPositions[0], y);
                    doc.text(`${record.doseAmount || ''} ml`, colPositions[1], y);
                    doc.text(`${(record.price || 0).toLocaleString()} VND`, colPositions[2], y);
                    doc.text(record.nextDoseDate ? record.nextDoseDate.split("T")[0] : '', colPositions[3], y);
                    doc.text(record.batchNumber || '', colPositions[4], y);
                    doc.text(record.status || '', colPositions[5], y);

                    // Handle long notes with wrapping
                    const notes = record.notes || '';
                    if (notes.length > 15) {
                        doc.text(notes.substring(0, 15), colPositions[6], y);
                        doc.text(notes.substring(15), colPositions[6], y + rowHeight / 2);
                        y += rowHeight;
                    } else {
                        doc.text(notes, colPositions[6], y);
                    }

                    y += rowHeight;

                    // Draw horizontal line after each row
                    doc.line(20, y - rowHeight / 2, 190, y - rowHeight / 2);
                });

                y += 5;
            }
        }

        // Calculate total price
        let totalPrice = 0;
        if (booking.bookingDetails && booking.bookingDetails.length > 0) {
            booking.bookingDetails.forEach((vaccineItem: any) => {
                totalPrice += vaccineItem.price || 0;
            });
        }

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`TOTAL AMOUNT: ${totalPrice.toLocaleString()} VND`, 20, y);
        y += 20;

        // Add signature fields
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');

        // Date field
        const today = new Date();
        const formattedDate = `Date: ${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
        doc.text(formattedDate, 105, y, { align: 'center' });
        y += 15;

        // Customer signature (left side)
        doc.text('Customer Signature', 50, y, { align: 'center' });
        doc.line(20, y + 25, 80, y + 25); // Signature line
        doc.text('(Sign and full name)', 50, y + 30, { align: 'center' });

        // Vaccine provider signature (right side)
        doc.text('Vaccine Provider', 160, y, { align: 'center' });
        doc.line(130, y + 25, 190, y + 25); // Signature line
        doc.text('(Sign and stamp)', 160, y + 30, { align: 'center' });

        // Add footer
        const pageCount = (doc as any).internal.getNumberOfPages();
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.text(
                `Page ${i} of ${pageCount} - Printed on: ${today.toLocaleDateString('en-US')}`,
                105,
                doc.internal.pageSize.height - 10,
                { align: 'center' }
            );
        }

        // Save the PDF
        doc.save(`Vaccination_Booking_${booking.bookingId || 'unknown'}_${booking?.childName|| 'unknown'}.pdf`);
        toast.success('PDF exported successfully!');
    } catch (error) {
        console.error('Error exporting PDF:', error);
        toast.error('Error occurred while exporting PDF!');
    }
};

// Helper function to translate status to English
const getStatusTextInEnglish = (status: string): string => {
    switch (status) {
        case 'Pending':
            return 'Pending';
        case 'Confirmed':
            return 'Confirmed';
        case 'InProgress':
            return 'In Progress';
        case 'Completed':
            return 'Completed';
        case 'Cancelled':
            return 'Cancelled';
        case 'RefundRequested':
            return 'Refund Requested';
        default:
            return status || '';
    }
};