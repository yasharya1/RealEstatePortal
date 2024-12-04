const express = require('express');
const appService = require('./appService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/check-db-connection', async (req, res) => {
    const isConnect = await appService.testOracleConnection();
    if (isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});

router.get('/demotable', async (req, res) => {
    const tableContent = await appService.fetchDemotableFromDb();
    res.json({data: tableContent});
});

router.get('/client-table', async (req, res) => {
    const tableContent = await appService.fetchClientTableFromDb();
    res.json({data: tableContent});
});

router.get('/viewings-table', async (req, res) => {
    const tableContent = await appService.fetchViewingTableFromDb();
    res.json({data: tableContent});
});

router.get('/all-viewings-table', async (req, res) => {
    const tableContent = await appService.fetchAllViewingsTableFromDb();
    res.json({data: tableContent});
});

router.post("/initiate-demotable", async (req, res) => {
    const initiateResult = await appService.initiateDemotable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-owns", async (req, res) => {
    const { phonenumber, address, postalcode, listingdate} = req.body;
    const insertResult = await appService.insertOwns(phonenumber, address, postalcode, listingdate);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});


router.post("/delete-wrong-owns", async (req, res) => {
    const { address, postalcode, listingdate, listingprice, size, imageLink} = req.body;
    const insertResult = await appService.deleteWrongOwns(address,postalcode, listingdate, 
        listingprice, size, imageLink);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});


router.post("/insert-demotable", async (req, res) => {
    const { address, postalcode, listingdate, listingprice, size, imageLink} = req.body;
    const insertResult = await appService.insertDemotable(address,postalcode, listingdate, 
        listingprice, size, imageLink);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-commercialtype", async (req, res) => {
    const { property_type, license } = req.body;
    const updateResult = await appService.insertCommercialType(property_type, license);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: 
            false });
    }
});

router.post("/insert-commercial", async (req, res) => {
    const { postalcode, listingdate, address, license } = req.body;
    const updateResult = await appService.insertCommercial(postalcode, listingdate, address, license);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/insert-residential", async (req, res) => {
    const { postalcode, listingdate, address, bathrooms, bedrooms } = req.body;
    const updateResult = await appService.insertResidential(postalcode, listingdate, address, bathrooms, bedrooms);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-name-demotable", async (req, res) => {
    const { phonenumber, value } = req.body;
    const updateResult = await appService.updateNameDemotable(phonenumber, value);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-email-demotable", async (req, res) => {
    const { phonenumber, value } = req.body;
    const updateResult = await appService.updateEmailDemotable(phonenumber, value);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-agentid-demotable", async (req, res) => {
    const { phonenumber, value } = req.body;
    const updateResult = await appService.updateAgentIDDemotable(phonenumber, value);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-address", async (req, res) => {
    const { phonenumber, value } = req.body;
    const updateResult = await appService.updateAdressDemotable(phonenumber, value);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/delete-viewing", async (req, res) => {
    const { viewdate, viewtime, phonenumber } = req.body;
    const updateResult = await appService.deleteViewing(viewdate, viewtime, phonenumber);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/property-addresses', async (req, res) => {
    try {
        const addresses = await appService.fetchPropertyAddresses();
        res.json({ 
            success: true,
            data: addresses 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: "Failed to fetch addresses" 
        });
    }
});

router.get('/group-by-properties', async (req, res) => {
    const properties = await appService.groupByProperties();
    if (properties) {
        res.json({ 
            success: true,
            data: properties 
        });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/having-properties', async (req, res) => {
    const maxPrice = parseFloat(req.query.maxPrice);
    if (!maxPrice || isNaN(maxPrice)) {
        return res.status(400).json({ 
            success: false, 
            error: "Invalid price parameter" 
        });
    }
    
    const properties = await appService.havingProperties(maxPrice);
    if (properties) {
        res.json({ 
            success: true,
            data: properties
        });
    } else {
        res.status(500).json({ 
            success: false,
            error: "Failed to fetch properties"
        });
    }
});

router.get('/nested-aggregation', async (req, res) => {

    const nestedResult = await appService.nestedAggregation();
    if(nestedResult) {
        res.json({
            success: true, 
            data: nestedResult
        })
    } else {
        res.status(500).json({success: false});
    }
});

router.post('/api/login', async (req, res) => {
    const { userType, identifier } = req.body;

    try {
        let isValid = false;

        if (userType === 'agent') {
            isValid = await appService.validateAgent(identifier);
        } else if (userType === 'buyer') {
            isValid = await appService.validateBuyer(identifier);
        } else if (userType === 'owner') {
            isValid = await appService.validateOwner(identifier);
        }

        if (isValid) {
            res.json({ 
                success: true,
                userType: userType,
                identifier: identifier
            });
        } else {
            res.json({ 
                success: false, 
                error: 'Invalid credentials'
            });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Login failed'
        });
    }
});

router.get('/api/check-connection', async (req, res) => {
    try {
        const isConnected = await appService.testOracleConnection();
        res.json({ 
            success: true, 
            connected: isConnected 
        });
    } catch (error) {
        res.json({ 
            success: false, 
            connected: false,
            error: error.message 
        });
    }
});

router.post("/api/register-agent", async (req, res) => {
    const { agentId, name, address, email, phoneNumber } = req.body;

    if (!agentId || !name || !address || !email || !phoneNumber) {
        return res.status(400).json({ success: false, error: 'All fields are required.' });
    }
    const registrationResult = await appService.registerNewUser('agent', name, address, email, phoneNumber, agentId);
    
    if (registrationResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false, error: 'Failed to register agent.' });
    }
});

router.post('/api/register', async (req, res) => {
    const { userType, name, address, email, phoneNumber } = req.body;
    
    try {
        const result = await appService.registerNewUser(userType, name, address, email, phoneNumber);
        
        if (result.success) {
            res.json({ 
                success: true,
                userType: userType,
                identifier: phoneNumber
            });
        } else {
            res.json({ 
                success: false, 
                error: result.error || 'Registration failed'
            });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Registration failed'
        });
    }
});

router.post("/update-buyer-demotable", async (req, res) => {
    const { phoneNumber, value } = req.body;
    const updateResult = await appService.updateBuyerDemotable(phoneNumber, value);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-client-demotable", async (req, res) => {
    const { phoneNumber, value } = req.body;
    const updateResult = await appService.updateClientDemotable(phoneNumber, value);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/division_query', async (req, res) => {
    const tableCount = await appService.division_query();
    res.json({data: tableCount});
});


// Defining route for selection query
router.post('/select-viewings', async (req, res) => {
    const {conditions} = req.body;

    const selectResult = await appService.selectViewings(conditions);
    if (selectResult) {
        res.json({ success: true, data: selectResult.rows, headers: selectResult.headers});
    } else {
        res.status(500).json({ success: false });
    }
})

router.post('/select-viewing-cols', async (req, res) => {
    const { cols } = req.body;
    if(!cols) {
        res.status(500).json({success: false});
    }
    const projectResult = await appService.selectViewingCols(cols);

    if (projectResult) {
        res.json({ success: true, data: projectResult.rows, headers: projectResult.headers });
    } else {
        res.status(500).json({ success: false });
    }
})

router.post('/select-property-manages', async (req, res) => {
    const {conditions} = req.body;
    if(!conditions) {
        res.status(500).json({success: false});
    }

    const joinResult = await appService.selectPropertyManages(conditions);

    if(joinResult){
        res.json({ success: true, data: joinResult.rows });
    } else {
        res.status(500).json({ success: false});
    }
})


module.exports = router;