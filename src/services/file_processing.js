const xlsx = require('xlsx')
const ExcelToJson = require('../models/excel_to_json')
const ExcelError = require('../models/excel_error')
const utils = require('../utils/string')

exports.processValue = async (type, cellValue) => {
  // TODO: add object support (not asked but NTH)
  let value
  // Perform type conversion if necessary
  if (type === 'number') {
    if (utils.containsOnlyNumbers(cellValue)) {
      value = parseFloat(cellValue)
    } else {
      throw new Error(`Value: ${cellValue} is not full number`)
    }
  } else {
    value = cellValue
  }
  return value
}

exports.processTask = async task => {
  let excelToJson = await ExcelToJson.get(task.id)
  excelToJson.status = 'processing'
  excelToJson = await excelToJson.save() // Save before updating in case the document has been updated by another process
  const workbook = xlsx.read(task.data.file)
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 })
  const headers = rows[0]
  const mapping = task.data.mapping
  const data = []
  const errors = []

  // await new Promise(resolve => setTimeout(resolve, 1000 * 20)); // Used for testing big excels

  // Loop through the rows, starting from the second row
  for (let rowNumber = 1; rowNumber < rows.length; rowNumber++) {
    const row = rows[rowNumber]
    const item = {}

    // Loop through the cells in the row and map to JSON
    for (let columnNumber = 0; columnNumber < headers.length; columnNumber++) {
      const value = row[columnNumber]
      // Get the mapping for the current column
      const mappingInfo = mapping[xlsx.utils.encode_col(columnNumber)]

      if (mappingInfo) {
        const { name, type } = mappingInfo
        try {
          item[name] = await this.processValue(type, value)
        } catch (error) {
          errors.push({
            row: rowNumber + 1,
            column: xlsx.utils.encode_col(columnNumber),
            error: error.message,
          })
          item[name] = null
        }
      }
    }
    data.push(item)
  }

  await createExcelErrors(errors, task)

  excelToJson.status = 'done'
  excelToJson.output = data
  excelToJson.errorCount = errors.length
  await excelToJson.save()
}

const createExcelErrors = async (errors, task) => {
  // less data insertions in the database
  // But cant get errors while processing depends on requirements, which is not clear
  await ExcelError.insertMany(
    errors.map(error => ({
      ...error,
      excelId: task.id,
    }))
  );
}
