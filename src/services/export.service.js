import { saveAs } from 'file-saver'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

// 导出为 CSV 文件
export const exportToCSV = (filename, data) => {
  if (!data || !data.length) {
    console.warn('没有数据可导出')
    return
  }

  const csvContent = data
    .map((row) => Object.values(row).join(',')) // 将每行数据转换为逗号分隔的字符串
    .join('\n') // 使用换行符分隔每行

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  saveAs(blob, `${filename}.csv`)
}

// 导出为 PDF 文件
export const exportToPDF = (filename, data) => {
  if (!data || !data.length) {
    console.warn('没有数据可导出')
    return
  }

  const doc = new jsPDF()
  const headers = Object.keys(data[0]) // 获取数据的列名
  const rows = data.map((row) => Object.values(row)) // 获取数据的行内容

  doc.text('导出数据', 10, 10) // 添加标题
  doc.autoTable({
    head: [headers],
    body: rows,
    startY: 20,
  })

  doc.save(`${filename}.pdf`)
}
