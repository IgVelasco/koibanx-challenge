// const xlsx = require('xlsx');
// const { validationResult } = require('express-validator');
const logger = require('../config/logger')
const TaskQueue = require('../services/task_queue')
const queue = new TaskQueue()

exports.upload = (req, res, next) => {
  logger.info(`File uploaded: ${req.file.originalname}`)
  
  const taskId = 'abc123'
  queue.addTask({id: taskId, data:{}})
  res.json({ taskId })
}

// exports.upload = (req, res, next) => {
//   let errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const mapping = JSON.parse(req.body.mapping);

//   // Process the uploaded excel file
//   const workbook = xlsx.read(req.file.buffer);
//   const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//   const json = xlsx.utils.sheet_to_json(worksheet, { defval: null });

//   // Map the columns using the provided mapping
//   const mapped = json.map((row) => {
//     const mappedRow = {};

//     Object.entries(mapping).forEach(([colIdentifier, mappingInfo]) => {
//         const { name, type } = mappingInfo;
//         const colIndex = xlsx.utils.decode_col(colIdentifier);
//         const cellRef = xlsx.utils.encode_cell({ r: row.__rowNum__, c: colIndex });
//         const value = worksheet[cellRef]?.v;

//         if (type === 'number') {
//           mappedRow[name] = parseFloat(value);
//         } else {
//           mappedRow[name] = value;
//         }
//       });

//     return mappedRow;
//   });

//   // Do something with the mapped data
//   // ...

//   // Call the callback to notify the client that the file has been processed
//   const callbackUrl = req.body.callbackUrl;
//   const taskId = 'abc123'; // Generate a task ID for the uploaded file
//   const status = 'done'; // Set the initial status to "done" since we've already processed the file
// //   errors = 0; // Set the initial number of errors to 0

//   // Make a request to the callback URL
//   // ...

//   // Return the task ID to the client
//   res.json({ taskId });
// }
