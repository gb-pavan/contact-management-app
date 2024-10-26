const express = require('express');
const app = express();
app.use(express.json());

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser'); // Use a library for CSV parsing
const xlsx = require('xlsx'); // For handling Excel files
const { createObjectCsvWriter } = require('csv-writer');
const {contactSchema } = require('../validators/userValidator');




const contactModel = require('../models/contacts');

exports.addContact = async (req,res) => {
    const {user_mail,contact}= req.body;
    console.log("controller mail",user_mail);
    const { name,
    email,
    phone,
    address,
    timezone}= contact;
    contactModel.addContact(user_mail,name,email,phone,address,timezone, async err => {
        if (err){
            return res.status(500).json({ error: err.message });
        }
        else{
            res.status(201).json({ message: 'Contact added successfully.' });
        }
    });
}

exports.getContacts = async (req, res) => {
    const { user_mail, filters = {}, sort = {}, dateRange = {} } = req.body;

    try {
        // Retrieve contacts from the database
        contactModel.getContacts(user_mail, filters, sort, dateRange, (err, contacts) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ contacts });
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to retrieve contacts." });
    }
};

exports.updateContact = async (req, res) => {
    const { user_mail,contactId, updates } = req.body;

    try {
        // Call the database function to update the contact
        contactModel.updateContact(user_mail,contactId, updates, (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (result.changes === 0) {
                // If no rows were updated, the contact may not exist or is deleted
                return res.status(404).json({ error: "Contact not found or has been deleted." });
            }
            res.status(200).json({ message: "Contact updated successfully.", result });
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to update contact." });
    }
};

// exports.deleteContact = async (req, res) => {
//     const { user_mail, contactId } = req.body;

//     try {
//         // Call the database function to delete the contact
//         contactModel.deleteContact(user_mail, contactId, (err, result) => {
//             if (err) {
//                 return res.status(500).json({ error: err.message });
//             }
//             if (result.changes === 0) {
//                 // If no rows were updated, the contact may not exist or doesn't belong to the user
//                 return res.status(404).json({ error: "Contact not found or doesn't belong to the user." });
//             }
//             res.status(200).json({ message: "Contact deleted successfully." });
//         });
//     } catch (err) {
//         res.status(500).json({ error: "Failed to delete contact." });
//     }
// };

exports.deleteContact = async (req, res) => {
    const { user_mail, contactId } = req.body;

    try {
        // Call the database function to delete the contact
        contactModel.deleteContact(user_mail, contactId, (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (result.changes === 0) {
                // If no rows were updated, the contact may not exist or doesn't belong to the user
                return res.status(404).json({ error: "Contact not found or doesn't belong to the user." });
            }
            res.status(200).json({ message: "Contact deleted successfully." });
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete contact." });
    }
};


exports.batchProcessContacts = async (req, res) => {
    const { user_mail, contacts = [] } = req.body;

    try {

        // Call the model function to process contacts
        contactModel.batchProcessContacts(user_mail, contacts, (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ message: 'Batch processing completed successfully.' });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.uploadContacts = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
    }

    const filePath = path.join(__dirname, '../uploads/', req.file.filename);

    const {user_mail} = req.body;

    // const filePath = '/home/pavan/contacts.csv';

    try {
        const contacts = [];
        

        // Check the file type and parse accordingly
        if (req.file.mimetype === 'text/csv') {
        // if (true) {

            // Parse CSV file
            fs.createReadStream(filePath)
                .pipe(csv())
                .on('data', (row) => {
                    // contacts.push(row);
                    const { error } = contactSchema.validate(row); // Validate each row with contactSchema
            
                    if (error) {
                        // Collect validation errors if any
                        // errors.push({ row, error: error.details });
                        return res.json({error:error});
                    } else {
                        // Add valid rows to the contacts array
                        contacts.push(row);
                    }
                })
                .on('end', async () => {
                    // Validate and save contacts
                    await processContacts(contacts,user_mail);
                    res.status(200).json({ message: 'Contacts uploaded successfully.', contacts });
                });
        } else {
            // Parse Excel file
            const workbook = xlsx.readFile(filePath);
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = xlsx.utils.sheet_to_json(worksheet);
            contacts.push(...jsonData);

            // Validate and save contacts
            await processContacts(res,contacts,user_mail);
            res.status(200).json({ message: 'Contacts uploaded successfully.', contacts });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to process the uploaded file.' });}
    // } finally {
    //     // Clean up: delete the uploaded file after processing
    //     fs.unlinkSync(filePath);
    // }
};

// Function to process contacts without using `res`
const processContacts = async (contacts, user_mail) => {
    for (const contact of contacts) {
        await new Promise((resolve, reject) => {
            contactModel.addContact(
                user_mail,
                contact.Name,
                contact.Email,
                contact.Phone,
                contact.Address,
                contact.Timezone,
                (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }
            );
        });
    }
};
// Ensure the exports directory exists
    if (!fs.existsSync('/home/pavan/projects/contact-management-app/exports')) {
        fs.mkdirSync('/home/pavan/projects/contact-management-app/exports', { recursive: true });
    }

// Function to download contacts
// exports.downloadContacts = async (req, res) => {
//     const userMail = req.query.user_mail; // Get user email from query parameters

    
    

//     try {
//         // Step 1: Fetch all contacts for the user
//         const contacts = await contactModel.getContactsByEmail(userMail);

//         if (contacts.length === 0) {
//             return res.status(404).json({ message: 'No contacts found for this user.' });
//         }

//         // Step 2: Choose format based on query param
//         const format = req.query.format || 'csv'; // Default to CSV
//         let filePath;

//         if (format === 'csv') {
//             // Create CSV file
//             filePath = path.join(__dirname, '../exports/contacts.csv');
//             const csvWriter = createObjectCsvWriter({
//                 path: filePath,
//                 header: [
//                     { id: 'name', title: 'Name' },
//                     { id: 'email', title: 'Email' },
//                     { id: 'phone', title: 'Phone' },
//                     { id: 'address', title: 'Address' },
//                     { id: 'timezone', title: 'Timezone' },
//                     { id: 'created_at', title: 'Created At' }
//                 ]
//             });
//             await csvWriter.writeRecords(contacts); // Write contacts to CSV
//         } else if (format === 'excel') {
//             // Create Excel file
//             filePath = path.join(__dirname, '../exports/contacts.xlsx');
//             const worksheet = xlsx.utils.json_to_sheet(contacts);
//             const workbook = xlsx.utils.book_new();
//             xlsx.utils.book_append_sheet(workbook, worksheet, 'Contacts');
//             xlsx.writeFile(workbook, filePath);
//         } else {
//             return res.status(400).json({ error: 'Unsupported file format. Choose csv or excel.' });
//         }

//         // Step 3: Send the file as a response for download
//         res.download(filePath, (err) => {
//             if (err) {
//                 console.error('File download failed:', err);
//                 res.status(500).json({ error: 'Failed to download file.' });
//             }
//             // Clean up the file after download
//             fs.unlinkSync(filePath);
//         });
//     } catch (error) {
//         console.error('Error retrieving contacts:', error);
//         res.status(500).json({ error: 'Failed to retrieve contacts.' });
//     }
// };


exports.downloadContacts = async (req, res) => {
    const user_mail = req.body.user_mail;
    const contacts = await contactModel.getContactsByEmail(user_mail); // Assume this gets all contacts

    const exportPath = path.join(__dirname, '../exports');
    if (!fs.existsSync(exportPath)) {
        fs.mkdirSync(exportPath, { recursive: true });
    }

    const filePath = path.join(exportPath, 'contacts.csv');
    const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: [
            { id: 'name', title: 'Name' },
            { id: 'email', title: 'Email' },
            { id: 'phone', title: 'Phone' },
            { id: 'address', title: 'Address' },
            { id: 'timezone', title: 'Timezone' },
            { id: 'created_at', title: 'Created At' }
        ]
    });

    try {
        await csvWriter.writeRecords(contacts);
        
        // Send the file as a response
        res.download(filePath, 'contacts.csv', (err) => {
            if (err) {
                console.error("Error sending file:", err);
                res.status(500).send("Could not download the file.");
            }
        });
    } catch (error) {
        console.error("Error creating CSV file:", error);
        res.status(500).send("Error creating CSV file.");
    }
};





