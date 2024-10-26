const express = require('express');
const contactController = require('../controllers/contactController');
const router = express.Router();
const upload = require('../middlewares/fileUpload');


router.post('/upload', upload.single('file'), contactController.uploadContacts)
router.post('/add-contact', contactController.addContact);
router.get('/get-contacts', contactController.getContacts);
router.post('/update-contact', contactController.updateContact);
router.post('/delete-contact', contactController.deleteContact);
router.post('/batch-update-contacts', contactController.batchProcessContacts);

// Route to download all contacts as a CSV or Excel file
router.get('/download', contactController.downloadContacts);


module.exports = router;