
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
    });2
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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TABLES FOR JEYSH QUERIES

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

function fetchTableData() {
    fetchAndDisplayAllViewings();
    fetchAndDisplayClients();
    fetchAndDisplayBookedViewings();
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Functions for selecting columns from the view table(projection query): allows buyer to select the columns they want included in the viewings
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

//Functions to select from viewings table(selection query): to allow buyer to find a convient viewing time. 
function createNewConditionViewing(withLogic) {
    createNewDynamicCondition("selectConditionsViewings", "condition", withLogic,
        [
            { value: "ViewingDate", label: "Date" },
            { value: "Time", label: "Time" },
            { value: "Address", label: "Address" },
            { value: "PostalCode", label: "Postal Code" },
            { value: "ListingDate", label: "Listing Date" }
        ]
    );
}

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

// JEYSH QUERIES START

var dropdown = document.getElementById("attribute-select");
var header = document.getElementById("information");
dropdown.addEventListener("change", function() {
    if (dropdown.value == "Agent ID") {
        header.textContent = (dropdown.value).concat("(Please choose from an existing Agent ID listed above)");
    } else {
        header.textContent = (dropdown.value);
    }
});


//update query 
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

// delete query
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


// JEYSH QUERIES END

//////////////////////////////////////////////////////////////////////////////////////////////////////////

// YASH QUERIES START

async function fetchHavingProperties(event) {
    event.preventDefault();
    const maxPrice = document.getElementById('maxPrice').value;
    const tableBody = document.getElementById('havingResults').querySelector('tbody');
    const button = document.querySelector('#havingQueryForm button');
    
    try {
        button.disabled = true;
        button.textContent = 'Loading...';
        tableBody.innerHTML = '<tr><td colspan="3">Loading...</td></tr>';
        
        const response = await fetch(`/having-properties?maxPrice=${maxPrice}`);
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
                cell.textContent = index === 1 ? `$${field.toLocaleString()}` : field;
            });
        });
    } catch (error) {
        console.error('Error:', error);
        tableBody.innerHTML = `<tr><td colspan="3">Error: ${error.message}</td></tr>`;
    } finally {
        button.disabled = false;
        button.textContent = 'Run Query';
    }
}

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
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function() {
    // Check if user is logged in
    const userType = sessionStorage.getItem('userType');
    const identifier = sessionStorage.getItem('identifier');
    
    // if (!userType || !identifier) {
    //     window.location.href = '/login.html';
    //     return;
    // }
    
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
    document.getElementById("addCondition").addEventListener("click",() => createNewConditionViewing(true));
    document.getElementById("selectViewingCols").addEventListener("submit", selectViewingCols);
    document.getElementById("selectViewingForm").addEventListener("submit", (event) => {
        event.preventDefault();
        handleDynamicFormSubmission(event, '/select-viewings', 'selectViewingsResultMsg')});
    document.getElementById("addConditionPropertyManages").addEventListener("click", () => createNewConditionPropertyManages(true));
    document.getElementById("selectPropertyManages").addEventListener("submit", (event) => {
        event.preventDefault();
        handleDynamicFormSubmission(event, '/select-property-manages', 'selectPropertyManagesResultMsg')});

    createNewConditionViewing(false);
    createNewConditionPropertyManages(false);

    // JEYSH QUERIES
    
    document.getElementById("updataNameDemotable").addEventListener("submit", updateNameDemotable);
    document.getElementById("deleteview").addEventListener("submit", deleteView);
    document.getElementById('havingQueryForm').addEventListener('submit', fetchHavingProperties);

    document.getElementById('nestedAggregationForm').addEventListener('submit', fetchNestedAggregation);
    
    
};




