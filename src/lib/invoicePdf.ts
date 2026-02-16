/**
 * Invoice PDF Generation Utility
 * Generates professional PDF invoices with price breakdown
 */

import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

interface GeneratePDFOptions {
  htmlElement: HTMLElement
  filename: string
  pageSize?: 'a4' | 'letter'
}

/**
 * Generate PDF from HTML element
 * @param options - Configuration for PDF generation
 */
export async function generatePdfFromHtml(options: GeneratePDFOptions): Promise<void> {
  const { htmlElement, filename, pageSize = 'a4' } = options

  try {
    // Capture the HTML as canvas
    const canvas = await html2canvas(htmlElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      windowHeight: htmlElement.scrollHeight,
      backgroundColor: '#ffffff',
    })

    // Create PDF
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: pageSize === 'a4' ? 'a4' : 'letter',
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = pageWidth - 20 // 10mm margins
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let heightLeft = imgHeight
    let position = 10 // 10mm margin

    // Add image to PDF, handling page breaks
    pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
    heightLeft -= pageHeight - 20

    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight)
      heightLeft -= pageHeight - 20
    }

    // Download PDF
    pdf.save(filename)
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw new Error('Failed to generate PDF invoice')
  }
}

/**
 * Helper: Sanitize text for PDF rendering (handle encoding issues)
 */
function sanitizeText(text: string): string {
  // Remove or replace problematic Unicode characters
  return text
    .replace(/₱/g, 'PHP ') // Replace peso symbol with 'PHP '
    .replace(/[^\x00-\x7F]/g, '') // Remove non-ASCII characters
    .trim()
}

/**
 * Alternative: Generate PDF with embedded content (text-based, more efficient)
 */
export function generateTextBasedPdf(
  invoiceData: {
    invoiceNumber: string
    date: string
    models: Array<{ name: string; weight: number; time: string; price: string }>
    addOns: Array<{ name: string; qty: number; price: string; total: string }>
    costs: {
      material: string
      electricity: string
      packaging: string
      shipping: string
      labor: string
      addOns: string
    }
    subtotal: string
    profit: string
    profitPercentage: number
    finalPrice: string
    currency: string
  },
  filename: string
): void {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const pageWidth = pdf.internal.pageSize.getWidth()
  let yPosition = 20

  // Font sizes
  const titleSize = 24
  const headingSize = 14
  const normalSize = 11
  const smallSize = 9

  // Title
  pdf.setFontSize(titleSize)
  pdf.setFont('', 'bold')
  pdf.text('INVOICE', pageWidth / 2, yPosition, { align: 'center' })

  yPosition += 15

  // Invoice Info
  pdf.setFontSize(smallSize)
  pdf.setFont('', 'normal')
  pdf.text(`Invoice #: ${sanitizeText(invoiceData.invoiceNumber)}`, 20, yPosition)
  pdf.text(`Date: ${sanitizeText(invoiceData.date)}`, pageWidth - 20, yPosition, { align: 'right' })

  yPosition += 15

  // Models Section
  pdf.setFontSize(headingSize)
  pdf.setFont('', 'bold')
  pdf.text('Models Summary', 20, yPosition)

  yPosition += 8

  // Models table header
  pdf.setFontSize(smallSize)
  pdf.setFont('', 'bold')
  const tableStartX = 20
  const colWidth = (pageWidth - 40) / 4
  pdf.text('Model', tableStartX, yPosition)
  pdf.text('Weight', tableStartX + colWidth, yPosition, { align: 'right' })
  pdf.text('Time', tableStartX + colWidth * 2, yPosition, { align: 'right' })
  pdf.text('Price', tableStartX + colWidth * 3, yPosition, { align: 'right' })

  yPosition += 7
  pdf.setDrawColor(100)
  pdf.line(20, yPosition - 2, pageWidth - 20, yPosition - 2)

  // Models data
  pdf.setFont('', 'normal')
  invoiceData.models.forEach((model) => {
    pdf.setFontSize(smallSize)
    pdf.text(sanitizeText(model.name), tableStartX, yPosition)
    pdf.text(model.weight.toString(), tableStartX + colWidth, yPosition, { align: 'right' })
    pdf.text(sanitizeText(model.time), tableStartX + colWidth * 2, yPosition, { align: 'right' })
    pdf.text(sanitizeText(model.price), tableStartX + colWidth * 3, yPosition, { align: 'right' })
    yPosition += 6
  })

  yPosition += 5

  // Add-ons Section (if any)
  if (invoiceData.addOns.length > 0) {
    pdf.setFontSize(headingSize)
    pdf.setFont('', 'bold')
    pdf.text('Add-ons & Extras', 20, yPosition)

    yPosition += 8

    // Add-ons table header
    pdf.setFontSize(smallSize)
    pdf.setFont('', 'bold')
    pdf.text('Item', tableStartX, yPosition)
    pdf.text('Qty', tableStartX + colWidth, yPosition, { align: 'right' })
    pdf.text('Unit', tableStartX + colWidth * 2, yPosition, { align: 'right' })
    pdf.text('Total', tableStartX + colWidth * 3, yPosition, { align: 'right' })

    yPosition += 7
    pdf.line(20, yPosition - 2, pageWidth - 20, yPosition - 2)

  // Add-ons data
    pdf.setFont('', 'normal')
    invoiceData.addOns.forEach((addon) => {
      pdf.setFontSize(smallSize)
      pdf.text(sanitizeText(addon.name), tableStartX, yPosition)
      pdf.text(addon.qty.toString(), tableStartX + colWidth, yPosition, { align: 'right' })
      pdf.text(sanitizeText(addon.price), tableStartX + colWidth * 2, yPosition, { align: 'right' })
      pdf.text(sanitizeText(addon.total), tableStartX + colWidth * 3, yPosition, { align: 'right' })
      yPosition += 6
    })

    yPosition += 5
  }

  // Cost Breakdown
  pdf.setFontSize(headingSize)
  pdf.setFont('', 'bold')
  pdf.text('Cost Breakdown', 20, yPosition)

  yPosition += 8

  pdf.setFontSize(smallSize)
  pdf.setFont('', 'normal')

  const breakdownItems = [
    { label: 'Material Cost', value: invoiceData.costs.material },
    { label: 'Electricity Cost', value: invoiceData.costs.electricity },
    { label: 'Packaging', value: invoiceData.costs.packaging },
    { label: 'Shipping', value: invoiceData.costs.shipping },
    { label: 'Labor', value: invoiceData.costs.labor },
  ]

  if (invoiceData.costs.addOns !== '0.00') {
    breakdownItems.push({ label: 'Add-ons', value: invoiceData.costs.addOns })
  }

  breakdownItems.forEach((item) => {
    pdf.text(item.label, 20, yPosition)
    pdf.text(sanitizeText(item.value), pageWidth - 20, yPosition, { align: 'right' })
    yPosition += 6
  })

  yPosition += 5

  // Totals
  pdf.setDrawColor(50)
  pdf.line(20, yPosition, pageWidth - 20, yPosition)
  yPosition += 8

  pdf.setFontSize(normalSize)
  pdf.setFont('', 'normal')
  pdf.text('Subtotal', 20, yPosition)
  pdf.text(sanitizeText(invoiceData.subtotal), pageWidth - 20, yPosition, { align: 'right' })

  yPosition += 7

  pdf.setFont('', 'bold')
  pdf.setTextColor(34, 197, 94) // green
  pdf.text(
    `Profit Margin (${invoiceData.profitPercentage}%)`,
    20,
    yPosition
  )
  pdf.text(sanitizeText(invoiceData.profit), pageWidth - 20, yPosition, { align: 'right' })

  yPosition += 10

  // Final Price
  pdf.setDrawColor(50)
  pdf.line(20, yPosition - 3, pageWidth - 20, yPosition - 3)
  pdf.setFontSize(16)
  pdf.setTextColor(34, 197, 94)
  pdf.text('TOTAL', 20, yPosition)
  pdf.text(sanitizeText(invoiceData.finalPrice), pageWidth - 20, yPosition, { align: 'right' })

  // Footer
  pdf.setFontSize(9)
  pdf.setTextColor(100)
  pdf.text(
    'Thank you for your business!',
    pageWidth / 2,
    pdf.internal.pageSize.getHeight() - 15,
    { align: 'center' }
  )

  // Download
  pdf.save(filename)
}

