module.exports = {
  stylesheet: ['docs/cronograma-pdf.css'],
  pdf_options: {
    format: 'A4',
    printBackground: true,
    margin: { top: '14mm', right: '12mm', bottom: '16mm', left: '12mm' },
  },
  dest: 'docs/CRONOGRAMA_EQUIPE.pdf',
};
