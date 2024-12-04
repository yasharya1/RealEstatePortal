
// This function checks the database connection and updates its status on the frontend.

async function checkDbConnection() {
    const dbStatus = document.getElementById('dbStatus');
    
    try {
        const response = await fetch('/api/check-connection');
        const data = await response.json();
        
        if (data.success) {
            dbStatus.textContent = 'Connected';
            dbStatus.className = 'connected';
        } else {
            dbStatus.textContent = 'Disconnected';
            dbStatus.className = 'disconnected';
        }
    } catch (error) {
        dbStatus.textContent = 'Disconnected';
        dbStatus.className = 'disconnected';
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//DISPLAY TABLES
// Fetches data from... and displays it.
async function fetchAndDisplayUsers() {
    const tableElement = document.getElementById('demotable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/demotable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}


// DISPLAY TABLES
// display property table (for insert query)
async function fetchAndDisplayUsers() {
    const tableElement = document.getElementById('demotable');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/demotable', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// Fetches viewings data from the clients table and displays it. (for update query)
async function fetchAndDisplayClients() {
    const tableElement = document.getElementById('client-table');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/client-table', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

function fetchTableData() {
    fetchAndDisplayUsers();
    fetchAndDisplayClients();
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//  EVENT LISTENER FUNCTIONS - JEYSH PART 

//INSERT PROPERTY (insert query)
async function insertDemotable(event) {
    event.preventDefault();
    const addressValue = document.getElementById('address').value;
    const postalcodeValue = document.getElementById('postalCode').value;
    const listingdateValue = document.getElementById('listingDate').value;
    const listingpriceValue = parseFloat(document.getElementById('listingPrice').value);
    const sizeValue = parseFloat(document.getElementById('size').value);
    const imagelinkValue = document.getElementById('imageLink').value; 

    const response = await fetch("/insert-demotable", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            address: addressValue,
            postalcode: postalcodeValue,
            listingdate: listingdateValue,
            listingprice: listingpriceValue,
            size: sizeValue,
            imageLink: imagelinkValue,
        })
    }); 
    const responseData = await response.json();
    const messageElement = document.getElementById('insertResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Property added successfully!";
        fetchTableData();
        await sleep(1000);
        insertOwns();

    } else {
        messageElement.textContent = "Error inserting property!  Please ensure that the property is not already listed at a given date!";
    }
    
}

//insert in owns table
async function insertOwns() {
    const phonenumberValue = document.getElementById('phone-number').value;
    const addressValue = document.getElementById('address').value;
    const postalcodeValue = document.getElementById('postalCode').value;
    const listingdateValue = document.getElementById('listingDate').value;

    const response_comm = await fetch("/insert-owns", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            phonenumber:phonenumberValue,
            address: addressValue,
            postalcode: postalcodeValue,
            listingdate: listingdateValue
            
        })
    }); 
    const responseData = await response_comm.json();
    const messageElement = document.getElementById('insertResultOwns');
    if (responseData.success) {
        messageElement.textContent = "Owns -  added successfully!";
        fetchTableData();
        selectedType = document.getElementById("type-select").value;
        if (selectedType == "Residential") {
        insertResidential();
         }
        else if (selectedType == "Commercial") {
        insertCommercialType();
         

    } else {
     messageElement.textContent = "Error inserting data! Please ensure you choose a residential or commercial type!";
     deleteWrongProperty('insertResultWrongOwns');

    }

    } else {
        messageElement.textContent = "Error inserting data! Please ensure that you have created an account first!";
        deleteWrongProperty('insertResultWrongOwns');
    }
}

//insert into commercial type
async function insertCommercialType() {
    
    const property_typeValue = document.getElementById('prop_type').value;
    const licenseValue = document.getElementById('license').value;

    const response_comm = await fetch("/insert-commercialtype", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            property_type: property_typeValue,
            license: licenseValue
            
        })
    }); 
    const responseData = await response_comm.json();
    const messageElement = document.getElementById('insertResultMsgProp');
    if (responseData.success) {
        messageElement.textContent = "Commercial type added successfully!";
        fetchTableData();
        await sleep(1000);
        insertCommercial();
    } else {
        messageElement.textContent = "Commercial type - Error inserting data! Please ensure this license is not already in use!";
        deleteWrongProperty('insertResultMsgPropWrong');
    }
}


// insert commercial
async function insertCommercial() {
    const addressValue = document.getElementById('address').value;
    const postalcodeValue = document.getElementById('postalCode').value;
    const listingdateValue = document.getElementById('listingDate').value;
    const licenseValue = document.getElementById('license').value;

    const response_comm = await fetch("/insert-commercial", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            postalcode: postalcodeValue,
            listingdate: listingdateValue,
            address: addressValue,
            license: licenseValue

        })
    });
    const responseData = await response_comm.json();
    const messageElement = document.getElementById('insertResultcomm');
    if (responseData.success) {
        messageElement.textContent = "Commercial added successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Commercial Property Error inserting data!";
    }
}


//insert residential
async function insertResidential() {

    const addressValue = document.getElementById('address').value;
    const postalcodeValue = document.getElementById('postalCode').value;
    const listingdateValue = document.getElementById('listingDate').value;
    const bathroomsValue = document.getElementById('num_bathrooms').value;
    const bedroomsValue = document.getElementById('num_bedrooms').value;

    const response_comm = await fetch("/insert-residential", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            postalcode: postalcodeValue,
            listingdate: listingdateValue,
            address: addressValue,
            bathrooms: bathroomsValue,
            bedrooms: bedroomsValue
        })
    });
    const responseData = await response_comm.json();
    const messageElement = document.getElementById('insertResultMsgProp');
    if (responseData.success) {
        messageElement.textContent = "Residential added successfully!";
        fetchTableData();
    } else {
        messageElement.textContent = "Residential Property Error inserting data!";
    }
}


// delete wrong property if inserted
async function deleteWrongProperty(msg_id) {
    const addressValue = document.getElementById('address').value;
    const postalcodeValue = document.getElementById('postalCode').value;
    const listingdateValue = document.getElementById('listingDate').value;
    const listingpriceValue = parseFloat(document.getElementById('listingPrice').value);
    const sizeValue = parseFloat(document.getElementById('size').value);
    const imagelinkValue = document.getElementById('imageLink').value; 

    const new_response = await fetch("/delete-wrong-owns", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            address: addressValue,
            postalcode: postalcodeValue,
            listingdate: listingdateValue,
            listingprice: listingpriceValue,
            size: sizeValue,
            imageLink: imagelinkValue,
        })
    }); 
    const new_responseData = await new_response.json();
    const newmessageElement = document.getElementById(msg_id);

    if (new_responseData.success) {
        newmessageElement.textContent = "Property removed - Please review your input and try again!";
        fetchTableData();
    }
    else {
        newmessageElement.textContent = "DID NOT DELETE PROPERTY!";
    };     

}

// dynamic option of selecting commercial or residential
function createNewPropertyCondition(type) {
    const condition = document.createElement("div");

    if (type == "Residential") {

        const bed = document.createTextNode("Number of Bedrooms: ");
        const bath = document.createTextNode("Number of Bathrooms: ");


        const bedrooms = document.createElement("input");
        bedrooms.type = "number";
        bedrooms.value = 0;
        bedrooms.name = "bedroom";
        bedrooms.id = "num_bedrooms"
        bedrooms.placeholder = "Enter number of bedrooms";

        const bathrooms = document.createElement("input");
        bathrooms.type = "number";
        bathrooms.value = 0;
        bathrooms.name = "bathroom";
        bathrooms.id = "num_bathrooms"
        bathrooms.placeholder = "Enter number of bathrooms";

        condition.appendChild(bed);
        condition.appendChild(bedrooms);
        condition.appendChild(bath);
        condition.appendChild(bathrooms);

        document.getElementById("selectConditions").appendChild(condition);

    } else if (type == "Commercial") {
        const label = document.createElement("label");
        label.setAttribute("for", "proptype");
        label.textContent = "Property Type: ";

        const proptype = document.createElement("select");
        proptype.name = "type";
        proptype.id = "prop_type";
        proptype.innerHTML =
            `<option value="Retail">Retail</option>
    <option value="Office">Office</option>
    <option value="Warehouse">Warehouse</option>
    <option value="Industrial">Industrial</option>
    <option value="Food Servic">Food Service</option>`;

        const license = document.createElement("input");
        license.type = "text";
        license.name = "license";
        license.id = "license"
        license.placeholder = "Enter licence";
        license.required = true;

        condition.appendChild(label);
        condition.appendChild(proptype);
        condition.appendChild(license);

        document.getElementById("selectConditions").appendChild(condition);
    }
}

var dropdown = document.getElementById("attribute-select");
var header = document.getElementById("information");
dropdown.addEventListener("change", function() {
    if (dropdown.value == "Agent ID") {
        header.textContent = (dropdown.value).concat("(Please choose from an existing Agent ID listed above)");
    } else {
        header.textContent = (dropdown.value);
    }
});


// UPDATE QUERY 
async function updateNameDemotable(event) {
    event.preventDefault();

    const phonenumberValue = document.getElementById('phonenumber').value;
    const newInfoValue = document.getElementById('updateInfo').value;

    var dropdown = document.getElementById("attribute-select");
    if (dropdown.value == "Name") {
        const response = await fetch('/update-name-demotable', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phonenumber: phonenumberValue,
                value: newInfoValue
            })
        });
        const responseData = await response.json();
        const messageElement = document.getElementById('updateNameResultMsg');

        if (responseData.success) {
            messageElement.textContent = "Name updated successfully!";
            fetchTableData();
        } else {
            messageElement.textContent = "Error updating name!";
        }
    }
    else if (dropdown.value == "Email") {
        const response = await fetch('/update-email-demotable', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phonenumber: phonenumberValue,
                value: newInfoValue
            })
        });

        const responseData = await response.json();
        const messageElement = document.getElementById('updateNameResultMsg');

        if (responseData.success) {
            messageElement.textContent = "Email Address updated successfully!";
            fetchTableData();
        } else {
            messageElement.textContent = "Error updating email address!";
        }

    } else if (dropdown.value == "Agent ID") {
        const newInfoValue = parseInt(document.getElementById('updateInfo').value);
        const response = await fetch('/update-agentid-demotable', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phonenumber: phonenumberValue,
                value: newInfoValue
            })
        });
        const responseData = await response.json();
        const messageElement = document.getElementById('updateNameResultMsg');

        if (responseData.success) {
            messageElement.textContent = "Agent ID updated successfully!";
            fetchTableData();
        } else {
            messageElement.textContent = "Error updating Agent ID!";
        }
    }

    else if (dropdown.value == "Address") {
        const response = await fetch('/update-address', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phonenumber: phonenumberValue,
                value: newInfoValue
            })
        });
        const responseData = await response.json();
        const messageElement = document.getElementById('updateNameResultMsg');

        if (responseData.success) {
            messageElement.textContent = "Address updated successfully!";
            fetchTableData();
        } else {
            messageElement.textContent = "Error updating Address!";
        }
    }
}

// JEYSH QUERIES END 
//////////////////////////////////////////////////////////////////////////////////////////////////////////

// SOPHIA QUERIES START
async function fetchAndDisplayPropertyManages(responseData) {
    const tableElement = document.getElementById('property-manages-table');
    const tableBody = tableElement.querySelector('tbody');
    const tableHeader = tableElement.querySelector('thead');

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }
    const demotableContent = responseData.data

    if(demotableContent.length === 0) {
        const row = tableBody.insertRow();
        const cell = row.insertCell(0);
        cell.colSpan = tableHeader.querySelectorAll("th").length;
        cell.textContent = "No matching viewings found";
        cell.style.textAlign = "center";
    }

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}
//SOPHIA QUERIES END 
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//YASH QUERIES START

//Functions to join Property and Manages(join query): to allow buyer to see which agency manages a respective property
function createNewConditionPropertyManages(withLogic) {
    createNewDynamicCondition("selectConditionsPropertyManages", "condition", withLogic,
        [
            { value: "M.AgencyName", label: "Agency Name" },
            { value: "P.Address", label: "Address" },
            { value: "P.PostalCode", label: "Postal Code" },
            { value: "P.ListingDate", label: "Listing Date" },
            { value: "P.ListingPrice", label: "Listing Price" },
            { value: "P.PropertySize", label: "Property Size" },
            { value: "P.ImagesLink", label: "Images Link" }
        ]
    );
}

//Sophia's Helper functions for join and select
async function handleDynamicFormSubmission(event, endpoint, messageID) {
    //event.preventDefault();
    const addedConditions = [];

    //double check that each dropdown is inside a form
    const form = event.target;
    const messageElement = document.getElementById(messageID);

    form.querySelectorAll(".condition").forEach(condition => {
        const logic = condition.querySelector('[name="logic"]')?.value;
        const field = condition.querySelector('[name="menu"]').value;
        const operator = condition.querySelector('[name="operator"]').value;
        const value = condition.querySelector('[name="value"]').value;


        if (value === '') {
            messageElement.textContent = "Please provide a value for all conditions.";
            return;
        }

        //const query = `${field} ${operator} '${value}'`;
        if (logic) {
            addedConditions.push( {"logic": logic, "field": field, "operator": operator, "value": value } );
        } else {
            addedConditions.push({ "field": field, "operator": operator, "value": value });
        }
    });
    //const queryBody = addedConditions.join(" ");

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            conditions: addedConditions
        })
    });

    const responseData = await response.json()
    if (responseData.success) {

        if (endpoint === '/select-viewings') {
            fetchAndDisplaySelectedViewings(responseData);
            messageElement.textContent = "Viewings filtered sucessfully!"
        } else {
            fetchAndDisplayPropertyManages(responseData)
            messageElement.textContent = "Properties filtered sucessfully!"
        }

    } else {
        messageElement.textContent = "Error selecting columns"
    }

}

function createNewDynamicCondition(containerID, conditionClass, withLogic, menuOptions) {
    const condition = document.createElement("div");
    condition.className = conditionClass;

    if (withLogic) {
        const logic = document.createElement("select");
        logic.name = "logic";
        logic.id = "logic";
        logic.innerHTML =
            `<option value="AND">AND</option>
        <option value="OR">OR</option>`;

        condition.appendChild(logic);
    }

    const menu = document.createElement("select");
    menu.name = "menu";
    menu.id = "menu";
    menu.innerHTML = menuOptions.map(option => `<option value = "${option.value}">${option.label}</option>`).join("");
    condition.appendChild(menu);

    const operator = document.createElement("select");
    operator.name = "operator";
    operator.id = "operator";
    operator.innerHTML =
        `<option value="=">is</option>
    <option value="!=">is not</option>
    <option value=">">is greater than </option>
    <option value="<">is less than </option>`;
    condition.appendChild(operator);

    const value = document.createElement("input");
    value.type = "text";
    value.name = "value";
    value.placeholder = "Enter desired value";
    condition.appendChild(value);
    document.getElementById(containerID).appendChild(condition);
}

// SOPHIA QUERIES END

//////////////////////////////////////////////////////////////////////////////////////////////////////////

// YASH QUERIES START
async function fetchNestedAggregation(event) {
    event.preventDefault();
    const tableBody = document.getElementById('nestedAggregationResults').querySelector('tbody');
        
    const response = await fetch(`/nested-aggregation`);
    const responseData = await response.json();
    const messageElement = document.getElementById('nestedaggregationmsg');
    console.log(messageElement);

    tableBody.innerHTML = '';
    if(responseData.success) {
        messageElement.textContent = "Properties fetched sucessfully!";
        console.log(responseData)
        console.log(JSON.stringify(responseData))
        responseData.data.forEach(property => {
            const row = tableBody.insertRow();
            property.forEach((field, index) => {
                const cell = row.insertCell(index);
                cell.textContent = field;
            })
        });
    } else {
        tableBody.innerHTML = '<tr><td>No properties found below price threshold</td></tr>';
        messageElement.textContent = "Error fetching properties!";
    }
}


// YASH QUERIES END

//////////////////////////////////////////////////////////////////////////////////////////////////////////




//////////////////////////////////////////////////////////////////////////////////////////////////////////
window.onload = function() {
    const elements = document.querySelectorAll('[data-role]');
    elements.forEach(element => {
        const allowedRoles = element.dataset.role.split(',');
        if (!allowedRoles.includes(userType)) {
            element.style.display = 'none';
        }
    });
    
    checkDbConnection();
    fetchTableData();

    // insert property - functionality
    document.getElementById("type-select").addEventListener("change",() => {
        const selectedType = document.getElementById("type-select").value;
            const conditionsContainer = document.getElementById("selectConditions");
        conditionsContainer.innerHTML = ""; 
            if (selectedType === "Residential" || selectedType === "Commercial") {
            createNewPropertyCondition(selectedType); 
        }
        });
    // insert property - submit button 
    document.getElementById("insertDemotable").addEventListener("submit", insertDemotable);
    // update information - submit button
    document.getElementById("updataNameDemotable").addEventListener("submit", updateNameDemotable);

    // JEYSH QUERIES END 
    // SOPHIA QUERIES START

    
    document.getElementById("addConditionPropertyManages").addEventListener("click", () => createNewConditionPropertyManages(true));
    document.getElementById("selectPropertyManages").addEventListener("submit", (event) => {
        event.preventDefault();
        handleDynamicFormSubmission(event, '/select-property-manages', 'selectPropertyManagesResultMsg')});
    //initialize dynamic dropdown for property manages    
    createNewConditionPropertyManages(false);

    document.getElementById('nestedAggregationForm').addEventListener('submit', fetchNestedAggregation);
    
};

