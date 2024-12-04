
// This function checks the database connection and updates its status on the frontend.

async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');

    try {
        const response = await fetch('/check-db-connection', {
            method: "GET"
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        statusElem.textContent = text;
    } catch (error) {
        console.error('Error fetching database connection:', error);
        statusElem.textContent = 'Connection timed out'; 
    } finally {
        loadingGifElem.style.display = 'none'; 
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

// Fetches viewings data from the attends table and displays it.
async function fetchAndDisplayBookedViewings() {
    const tableElement = document.getElementById('viewings-table');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/viewings-table', {
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

//Fetches data from viewings table accoring to user inputted where clause
async function fetchAndDisplaySelectedViewings(responseData) {
    const tableElement = document.getElementById('all-viewings-table');
    const tableBody = tableElement.querySelector('tbody');

    const demotableContent = responseData.data

    const tableHeader = tableElement.querySelector("thead");
    if(tableHeader) {
        tableHeader.innerHTML = "";
        const columns = responseData.headers;
        columns.forEach(column => {
            const header = document.createElement("th");
            header.textContent = column
            tableHeader.appendChild(header);
        })
    }

    if (tableBody) {
        tableBody.innerHTML = '';
    }

    if(demotableContent.length === 0) {
        const row = tableBody.insertRow();
        const cell = row.insertCell(0);
        cell.colSpan = tableHeader.querySelectorAll("th").length;
        cell.textContent = "No matching viewings found";
        cell.style.textAlign = "center";
    }

    demotableContent.forEach(viewing => {
        const row = tableBody.insertRow();
        Object.values(viewing).forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

// Fetches data from the clients and displays it.
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

async function fetchAndDisplayAllViewings() {
    const tableElement = document.getElementById('all-viewings-table');
    const tableBody = tableElement.querySelector('tbody');

    const response = await fetch('/all-viewings-table', {
        method: 'GET'
    });

    const responseData = await response.json();
    const demotableContent = responseData.data;

    // Always clear old, already fetched data before new fetching process.
    if (tableBody) {
        tableBody.innerHTML = '';
    }

    const tableHeader = tableElement.querySelector("thead");
    if(tableHeader) {
        tableHeader.innerHTML = "";
        const columns = ["Time", "Date", "Address", "Postal Code", "Listing Date"];
        columns.forEach(column => {
            const header = document.createElement("th");
            header.textContent = column
            tableHeader.appendChild(header);
        })
    }

    demotableContent.forEach(viewing => {
        const row = tableBody.insertRow();
        Object.values(viewing).forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });

    demotableContent.forEach(user => {
        const row = tableBody.insertRow();
        user.forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });
}

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

// This function resets or initializes the demotable.
async function resetDemotable() {
    const response = await fetch("/initiate-demotable", {
        method: 'POST'
    });
    const responseData = await response.json();

    if (responseData.success) {
        const messageElement = document.getElementById('resetResultMsg');
        messageElement.textContent = "demotable initiated successfully!";
        fetchTableData();
    } else {
        alert("Error initiating table!");
    }
}

// Inserts new property into the demotable 
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
    } else {
        messageElement.textContent = "Error inserting property!  Please ensure that the property is not already listed at a given date!";
    }
    await sleep(1000);
    insertOwns();


    await sleep(2000);

}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//JEYSH CODE
//insert owns
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
    }
    } else {
        messageElement.textContent = "Error inserting data! Please ensure that you have created an account first!";
        deleteWrongProperty('insertResultWrongOwns');
    }
}


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
            newmessageElement.textContent = "Property removed";
            fetchTableData();
        }
        else {
            newmessageElement.textContent = "DID NOT DELETE PROPERTY!";
        };     

}


//insert commercial type
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
// Update personal attribute in current client list
var dropdown = document.getElementById("attribute-select");
var header = document.getElementById("information");
dropdown.addEventListener("change", function () {
    if (dropdown.value == "Agent ID") {
        header.textContent = (dropdown.value).concat("(Please choose from an existing Agent ID listed above)");
    } else {
        header.textContent = (dropdown.value);
    }
});


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

async function deleteView(event) {
    event.preventDefault();
    const phonenumberValue = document.getElementById('view-phone-number').value;
    const timeValue = document.getElementById('view-time').value;
    const dateValue = document.getElementById('view-date').value;

    const response_comm = await fetch("/delete-viewing", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            viewdate: dateValue,
            viewtime: timeValue,
            phonenumber: phonenumberValue
        })
    });
    const responseData = await response_comm.json();
    const messageElement = document.getElementById('deletedviewmsg');
    if (responseData.success) {
        messageElement.textContent = "Viewing successfully deleted!";
        fetchTableData();
    } else {
        messageElement.textContent = "Error in deleting viewing!";
    }
}

async function division_query(event) {
    event.preventDefault();
    var popup = document.getElementById("myPopup");
    popup.style.display = "block";

    const response = await fetch("/division_query", {
        method: 'GET'
    });

    const responseData = await response.json();
    const subtitle = document.createElement("h4");
    subtitle.textContent = "List of names: ";
    outputElement.appendChild(subtitle);

    const names = responseData.data.flat();
    names.forEach(name => {
        const nameElement = document.createElement("p");
        nameElement.textContent = name;
        outputElement.appendChild(nameElement);
    });

}

const outputElement = document.getElementById('popup_msg');

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//SOPHIA CODE

//Selects Columns for projection query
async function selectViewingCols(event) {
    event.preventDefault();
    const selectedCols = [];
    const checked = document.querySelectorAll('input[name="column"]:checked');

    checked.forEach((checkbox) => {
        selectedCols.push(checkbox.value);
    });


    const response = await fetch('/select-viewing-cols', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            cols: selectedCols
        })
    });

    const responseData = await response.json()
    const messageElement = document.getElementById('selectViewingColsResultMsg');

    if (responseData.success) {
        messageElement.textContent = "Columns selected sucessfully!"
        fetchAndDisplaySelectedViewings(responseData);
    } else {
        messageElement.textContent = "Error selecting columns"
    }
}

function createNewConditionViewing(withLogic) {
    createNewPropertyCondition("selectConditionsViewings", "condition", withLogic,
        [
            { value: "ViewingDate", label: "Date" },
            { value: "Time", label: "Time" },
            { value: "Address", label: "Address" },
            { value: "PostalCode", label: "Postal Code" },
            { value: "ListingDate", label: "Listing Date" }
        ]
    );
}

function createNewConditionPropertyManages(withLogic) {
    createNewPropertyCondition("selectConditionsPropertyManages", "condition", withLogic,
        [
            { value: "M.AgencyName", label: "Agency Name" },
            { value: "P.Address", label: "Address" },
            { value: "P.PostalCode", label: "Postal Code" },
            { value: "P.ListingDate", label: "Listing Date" },
            { value: "P.ListingPrice", label: "Listing Price" },
            { value: "P.Size", label: "Property Size" },
            { value: "P.ImagesLink", label: "Images Link" }
        ]
    );
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

        const query = `${field} ${operator} '${value}'`;
        if (logic) {
            addedConditions.push(`${logic} ${query}`);
        } else {
            addedConditions.push(query);
        }
    });
    const queryBody = addedConditions.join(" ");

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            conditions: queryBody
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    // Check if user is logged in
    const userType = sessionStorage.getItem('userType');
    const identifier = sessionStorage.getItem('identifier');
    
    if (!userType || !identifier) {
        window.location.href = '/login.html';
        return;
    }
    
    // Show/hide elements based on user type
    const elements = document.querySelectorAll('[data-role]');
    elements.forEach(element => {
        const allowedRoles = element.dataset.role.split(',');
        if (!allowedRoles.includes(userType)) {
            element.style.display = 'none';
        }
    });
    
    checkDbConnection();
    fetchTableData();
    
    document.getElementById("type-select").addEventListener("change",() => {
        const selectedType = document.getElementById("type-select").value;
            const conditionsContainer = document.getElementById("selectConditions");
        conditionsContainer.innerHTML = ""; 
            if (selectedType === "Residential" || selectedType === "Commercial") {
            createNewCondition(selectedType); 
        }
        });
    document.getElementById("insertDemotable").addEventListener("submit", insertDemotable);
    document.getElementById("updataNameDemotable").addEventListener("submit", updateNameDemotable);
    document.getElementById("deleteview").addEventListener("submit", deleteView);
    document.getElementById("openBtn").addEventListener("click", division_query); 
    document.getElementById("addCondition").addEventListener("click",() => createNewConditionViewing(true));
    document.getElementById("updataNameDemotable").addEventListener("submit", updateNameDemotable);
    document.getElementById("selectViewingCols").addEventListener("submit", selectViewingCols);
    document.getElementById("selectViewingForm").addEventListener("submit", (event) => {
        event.preventDefault();
        handleDynamicFormSubmission(event, '/select-viewings', 'selectViewingsResultMsg')});
    document.getElementById("addConditionPropertyManages").addEventListener("click", () => createNewConditionPropertyManages(true));
    document.getElementById("selectPropertyManages").addEventListener("submit", (event) => {
        event.preventDefault();
        handleDynamicFormSubmission(event, '/select-property-manages', 'selectPropertyManagesResultMsg')});

    document.getElementById('havingQueryForm').addEventListener('submit', fetchHavingProperties);
    document.getElementById('nestedAggregationQuery').addEventListener('click', fetchNestedAggregation);

    createNewConditionViewing(false);
    createNewConditionPropertyManages(false);
};

window.addEventListener('load', function() {
    loadPropertyAddresses();
    document.getElementById('groupByQueryForm').addEventListener('submit', fetchGroupByProperties);
});

function fetchTableData() {
    fetchAndDisplayUsers();
    fetchAndDisplayClients();
    fetchAndDisplayBookedViewings();
    fetchAndDisplayAllViewings();
}

// Get elements
var openBtn = document.getElementById("openBtn");
var popup = document.getElementById("myPopup");
var closeBtn = document.getElementById("closeBtn");

// Close the popup
closeBtn.onclick = function() {
    outputElement.textContent = '';
    popup.style.display = "none";
}

// Close the popup if clicked outside of the popup content
window.onclick = function(event) {
  if (event.target == popup) {
    outputElement.textContent = '';
    popup.style.display = "none";
  }
}

async function fetchHavingProperties(event) {
    event.preventDefault();
    const maxPrice = document.getElementById('inputPrice').value;
    const tableBody = document.getElementById('havingResults').querySelector('tbody');
    const submitButton = event.target.querySelector('button');
    
    try {
        submitButton.disabled = true;
        submitButton.textContent = 'Loading...';
        tableBody.innerHTML = '<tr><td colspan="3">Loading...</td></tr>';
        
        const response = await fetch(`/having-properties?maxPrice=${maxPrice}`);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch properties');
        }
        
        const responseData = await response.json();
        
        tableBody.innerHTML = '';
        
        if (!responseData.data || responseData.data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="3">No properties found below $' + maxPrice + '</td></tr>';
            return;
        }
        
        responseData.data.forEach(property => {
            const row = tableBody.insertRow();
            property.forEach((field, index) => {
                const cell = row.insertCell(index);
                cell.textContent = index === 2 ? `$${field.toLocaleString()}` : field;
            });
        });
    } catch (error) {
        console.error('Detailed error:', error);
        tableBody.innerHTML = `<tr><td colspan="3">Error: ${error.message}</td></tr>`;
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = 'Run Query';
    }
}


async function fetchNestedAggregation() {
    const tableBody = document.getElementById('nestedAggregationResults').querySelector('tbody');
    const averageDisplay = document.getElementById('averagePriceDisplay');
    const button = document.getElementById('nestedAggregationQuery');
    
    try {
        button.disabled = true;
        button.textContent = 'Loading...';
        tableBody.innerHTML = '<tr><td colspan="4">Loading...</td></tr>';
        averageDisplay.style.display = 'none';
        
        const response = await fetch('/nested-aggregation');
        const responseData = await response.json();
        
        if (!responseData.success) {
            throw new Error(responseData.error || 'Failed to fetch properties');
        }
        averageDisplay.style.display = 'block';
        averageDisplay.textContent = `Current Market Average: $${Math.round(responseData.data.averagePrice).toLocaleString()}`;
        

        tableBody.innerHTML = '';
        
        if (!responseData.data.properties || responseData.data.properties.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="4">No properties found below average price</td></tr>';
            return;
        }
        
        responseData.data.properties.forEach(property => {
            const row = tableBody.insertRow();
            property.forEach((field, index) => {
                const cell = row.insertCell(index);
                cell.textContent = index === 3 ? `$${field.toLocaleString()}` : field;
            });
        });
    } catch (error) {
        console.error('Error:', error);
        tableBody.innerHTML = `<tr><td colspan="4">Error: ${error.message}</td></tr>`;
        averageDisplay.style.display = 'none';
    } finally {
        button.disabled = false;
        button.textContent = 'Run Query';
    }
}


async function loadPropertyAddresses() {
    console.log("Loading property addresses...");
    try {
        const response = await fetch('/property-addresses');
        const data = await response.json();
        
        if (!data.success) {
            throw new Error(data.error || 'Failed to fetch addresses');
        }
        
        const select = document.getElementById('propertyAddress');
        select.innerHTML = '<option value="">--Select an address--</option>';
        
        data.data.forEach(address => {
            const option = document.createElement('option');
            option.value = address[0];
            option.textContent = address[0];
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading addresses:', error);
    }
}
