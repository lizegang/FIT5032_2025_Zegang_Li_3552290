import { saveAs } from 'file-saver'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'

// 导出为CSV
export const exportToCSV = (data, filename, headers = null) => {
  try {
    if (!data || data.length === 0) {
      throw new Error('No data to export')
    }

    // 使用数据中的键作为默认标题
    const dataHeaders = headers || Object.keys(data[0])

    // 创建CSV内容
    let csvContent = dataHeaders.join(',') + '\n'

    // 添加数据行
    data.forEach((item) => {
      const row = dataHeaders.map((header) => {
        const value = item[header] !== undefined ? item[header] : ''
        // 处理包含逗号或引号的值
        return `"${value.toString().replace(/"/g, '""')}"`
      })
      csvContent += row.join(',') + '\n'
    })

    // 创建Blob并保存
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, `${filename}.csv`)

    return true
  } catch (error) {
    console.error('Error exporting to CSV:', error)
    return false
  }
}

// 导出为PDF
export const exportToPDF = (data, filename, headers = null) => {
  try {
    if (!data || data.length === 0) {
      throw new Error('No data to export')
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

    // 保存PDF
    doc.save(`${filename}.pdf`)

    return true
  } catch (error) {
    console.error('Error exporting to PDF:', error)
    return false
  }
}
      body: tableData,
      startY: 30,
      theme: 'striped',
    })

    // 保存PDF
    doc.save(`${filename}.pdf`)

    return true
  } catch (error) {
    console.error('Error exporting to PDF:', error)
    return false
  }
}
