import jsPDF from 'jspdf';
import { toast } from "react-toastify";

// Extend the jsPDF type to include the autotable plugin
declare module 'jspdf' {
    interface jsPDF {
        autoTable: (options: any) => jsPDF;
    }
}

export const exportPDF = (booking: any, combo: any, vaccine: any) => {
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
            ['Booking Date:', new Date(booking.bookingDate).toLocaleDateString('en-US') || ''],
            ['Vaccination Type:', booking.bookingType || ''],
            ['Notes:', booking.note || 'None'],
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

        // Add combo details if available
        if (combo && combo.length > 0) {
            y += 5;
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('COMBO DETAILS', 20, y);
            y += 10;

            combo.forEach((comboItem: any) => {
                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
                doc.text(`Combo Name: ${comboItem.comboName || ''}`, 20, y);
                y += 7;
                doc.setFont('helvetica', 'normal');
                doc.text(`Combo Price: ${(comboItem.totalPrice || 0).toLocaleString()} VND`, 20, y);
                y += 7;

                doc.setFont('helvetica', 'bold');
                doc.text('Vaccines in Combo:', 20, y);
                y += 7;

                // List vaccines in the combo
                if (comboItem.vaccines && Array.isArray(comboItem.vaccines)) {
                    comboItem.vaccines.forEach((vaccineItem: any) => {
                        doc.setFont('helvetica', 'normal');
                        doc.text(`- ${vaccineItem.vaccine?.name || ''}`, 25, y);
                        y += 7;
                    });
                }

                y += 3;
            });
        }

        // Add individual vaccine details if available
        if (vaccine && vaccine.length > 0 && (!combo || combo.length === 0)) {
            y += 5;
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text('VACCINE DETAILS', 20, y);
            y += 10;

            vaccine.forEach((vaccineItem: any) => {
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.text(`Vaccine Name: ${vaccineItem.name || ''}`, 20, y);
                y += 7;
                doc.text(`Price: ${(vaccineItem.price || 0).toLocaleString()} VND`, 20, y);
                y += 7;
            });
        }

        // Add total price
        let totalPrice = 0;

        if (combo && combo.length > 0) {
            combo.forEach((comboItem: any) => {
                totalPrice += comboItem.totalPrice || 0;
            });
        } else if (vaccine && vaccine.length > 0) {
            vaccine.forEach((vaccineItem: any) => {
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
        const formattedDate = `Date: ${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
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
