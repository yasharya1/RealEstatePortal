const oracledb = require('oracledb');
const loadEnvFile = require('./utils/envUtil');

const envVariables = loadEnvFile('./.env');

// Database configuration setup. Ensure your .env file has the required database credentials.
const dbConfig = {
    user: envVariables.ORACLE_USER,
    password: envVariables.ORACLE_PASS,
    connectString: `${envVariables.ORACLE_HOST}:${envVariables.ORACLE_PORT}/${envVariables.ORACLE_DBNAME}`,
    poolMin: 1,
    poolMax: 3,
    poolIncrement: 1,
    poolTimeout: 60
};

// initialize connection pool
async function initializeConnectionPool() {
    try {
        await oracledb.createPool(dbConfig);111
        console.log('Connection pool started');
    } catch (err) {
        console.error('Initialization error: ' + err.message);
    }
}

async function closePoolAndExit() {
    console.log('\nTerminating');
    try {
        await oracledb.getPool().close(10); // 10 seconds grace period for connections to finish
        console.log('Pool closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

initializeConnectionPool();

process
    .once('SIGTERM', closePoolAndExit)
    .once('SIGINT', closePoolAndExit);


// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(callback) {
    let connection;
    try {
        // console.log('Attempting to establish database connection...');
        connection = await oracledb.getConnection();
        // console.log('Database connection established successfully');
        return await callback(connection);
    } catch (error) {
        // console.error('Database connection error:', error);
        throw error;
    } finally {
        if (connection) {
            try {
                await connection.close();
                // console.log('Database connection closed');
            } catch (error) {
                // console.error('Error closing database connection:', error);
            }
        }
    }
}


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}

async function fetchDemotableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Property');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchClientTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM ClientHires');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchAllViewingsTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM ViewingHas');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchViewingTableFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Attends');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function insertDemotable(address,postalcode, listingdate, 
    listingprice, size, imageLink) {
    const listingPriceInt = parseInt(listingprice);
    const sizeInt = parseInt(size);
    return await withOracleDB(async (connection) => {
        const propertyResult = await connection.execute(
            'INSERT INTO Property(Address, PostalCode, ListingDate, ListingPrice, PropertySize, ImagesLink) VALUES (:address, :postalcode, :listingDate, :listingPriceInt, :sizeInt, :imageLink)',
            [address, postalcode, listingdate, listingPriceInt, sizeInt, imageLink],
            { autoCommit: true }
        );

        return propertyResult.rowsAffected && propertyResult.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function insertOwns(phonenumber, address, postalcode, listingdate) {
    return await withOracleDB(async (connection) => {
        const propertyResult = await connection.execute(
            'INSERT INTO Owns(OwnerPhoneNumber, PostalCode, ListingDate, Address) VALUES (:phonenumber, :postalcode, :listingdate, :address)',
            [phonenumber, postalcode, listingdate, address],
            { autoCommit: true }
        );

        return propertyResult.rowsAffected && propertyResult.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}


async function deleteWrongOwns(address,postalcode, listingdate, listingprice, size, imageLink){
    const listingPriceInt = parseInt(listingprice);
    const sizeInt = parseInt(size);
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'DELETE FROM Property WHERE Address = :address AND PostalCode = :postalcode AND ListingDate = :listingdate AND ListingPrice = :listingPriceInt AND PropertySize = :sizeInt AND ImagesLink = :imageLink',
            {  address: address , postalcode: postalcode, listingdate: listingdate, listingPriceInt: listingPriceInt, sizeInt: sizeInt, imageLink: imageLink },
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function deleteViewing(viewdate, viewtime, phonenumber) {
    return await withOracleDB(async (connection) => {
        // Ensure bind variable names in the query match the keys in the object
        const result = await connection.execute(
            'DELETE FROM Attends WHERE ViewingDate = :viewdate AND Time = :viewtime AND BuyerPhoneNumber = :phonenumber',
            {  viewdate: viewdate, viewtime: viewtime, phonenumber: phonenumber },
            { autoCommit: true }
        );
        // Check if any rows were affected
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}






async function insertCommercialType(property_type, license) {
    return await withOracleDB(async (connection) => {
        const commercial_prop = await connection.execute(
            'INSERT INTO CommercialType (Type, Licence) VALUES (:property_type, :license)',
            [property_type, license],
            { autoCommit: true }
        );
        return commercial_prop.rowsAffected && commercial_prop.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function insertCommercial(postalcode, listingdate, address, license) {
    return await withOracleDB(async (connection) => {
        const commercial_prop = await connection.execute(
            'INSERT INTO Commercial (Address, PostalCode, ListingDate, Licence) VALUES (:address, :postalcode, :listingdate, :license)',
            [address, postalcode, listingdate,license],
            { autoCommit: true }
        );
        return commercial_prop.rowsAffected && commercial_prop.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function insertResidential(postalcode, listingdate, address, bathrooms, bedrooms) {
    return await withOracleDB(async (connection) => {
        const commercial_prop = await connection.execute(
            'INSERT INTO Residential (Address, PostalCode, ListingDate, Bathrooms, Bedrooms) VALUES (:address, :postalcode, :listingdate, :bathrooms, :bedrooms)',
            [address, postalcode, listingdate,bathrooms, bedrooms],
            { autoCommit: true }
        );
        return commercial_prop.rowsAffected && commercial_prop.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateNameDemotable(phonenumber, value) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE ClientHires SET Name = :value WHERE PhoneNumber = :phonenumber`,
            { value: value, phonenumber: phonenumber },
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateEmailDemotable(phonenumber, value) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE ClientHires SET Email = :value WHERE PhoneNumber = :phonenumber`,
            { value: value, phonenumber: phonenumber },
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateAgentIDDemotable(phonenumber, value) {
    const id = parseInt(value)
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE ClientHires SET AgentID = :id WHERE PhoneNumber = :phonenumber`,
            { id: id, phonenumber: phonenumber },
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

// async function updateBuyerDemotable(phoneNumber, value) {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute(
//             `UPDATE Buyer SET PhoneNumber = :value WHERE PhoneNumber = :phoneNumber`,
//             { value: value, phoneNumber: phoneNumber },
//             { autoCommit: true }
//         );
//         return result.rowsAffected && result.rowsAffected > 0;
//     }).catch(() => {
//         return false;
//     });
// }

// async function updateClientDemotable(phoneNumber, value) {
//     return await withOracleDB(async (connection) => {
//         const result = await connection.execute(
//             `UPDATE Client SET PhoneNumber = :value WHERE PhoneNumber = :phoneNumber`,
//             { value: value, phoneNumber: phoneNumber },
//             { autoCommit: true }
//         );
//         return result.rowsAffected && result.rowsAffected > 0;
//     }).catch(() => {
//         return false;
//     });
// }

async function updateAdressDemotable(phonenumber, value){
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE ClientHires SET Address = :value WHERE PhoneNumber = :phonenumber`,
            { value: value, phonenumber: phonenumber },
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}



async function division_query() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`SELECT CH.Name FROM Buyer B, ClientHires CH WHERE NOT EXISTS  ((SELECT EI.AgreementID FROM  EntersInto EI WHERE EI.BuyerPhoneNumber = B.PhoneNumber) MINUS (SELECT SA.agreementId FROM SaleAgreementAppliesTo SA WHERE SA.Status = 'Completed')) AND B.PhoneNumber = CH.PhoneNumber`);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function groupByProperties() {
    return await withOracleDB(async (connection) => {
        try {
            console.log('Executing group by query...');
            const result = await connection.execute(`
                SELECT PaymentMethod, COUNT(*) AS PaymentCount
                FROM PaymentSettles
                GROUP BY PaymentMethod
                ORDER BY PaymentCount DESC
            `);
            return result.rows;
        } catch (error) {
            console.error('Group by query error:', error);
            return [];
        }
    });
}

async function havingProperties(maxPrice) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(`
            SELECT COUNT(*), ListingPrice
            FROM Property
            WHERE ListingPrice <= :maxPrice
            GROUP BY ListingPrice
            HAVING COUNT(*) >= 1
            ORDER BY ListingPrice
        `, [maxPrice]);
        return result.rows;
    }).catch((error) => {
        console.error('Having query error:', error);
        return false;
    });
}


async function nestedAggregation() {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(`
                SELECT P.Address, P.PostalCode, P.ListingDate, P.PropertySize, P.ListingPrice
                FROM Property P
                WHERE P.ListingPrice < (
                    SELECT AVG(P2.ListingPrice)
                    FROM Property P2
                    WHERE P2.PropertySize = P.PropertySize
                    GROUP BY P2.PropertySize
                )
                ORDER BY P.PropertySize`);

            return result.rows
        } catch (error) {
            console.error('Nested aggregation error:', error);
            return false;
        }
    });
}



async function validateAgent(phoneNumber) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT COUNT(*) FROM AgentEmploys WHERE PhoneNumber = :phone',
            [phoneNumber]
        );
        return result.rows[0][0] > 0;
    }).catch(() => {
        return false;
    });
}

async function validateBuyer(phoneNumber) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT COUNT(*) FROM Buyer WHERE PhoneNumber = :phone',
            [phoneNumber]
        );
        return result.rows[0][0] > 0;
    }).catch(() => false);
}

async function validateOwner(phoneNumber) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            'SELECT COUNT(*) FROM Owner WHERE PhoneNumber = :phone',
            [phoneNumber]
        );
        return result.rows[0][0] > 0;
    }).catch(() => false);
}

async function registerNewUser(userType, name, address, email, phoneNumber, agentId) {
    return await withOracleDB(async (connection) => {
        const clientResult = await connection.execute(
            `INSERT INTO ClientHires(Name, Address, Email, PhoneNumber, AgentID) 
             VALUES (:name, :address, :email, :phoneNumber, :agentId)`,
            [name, address, email, phoneNumber, agentId || null],
            { autoCommit: false }
        );

        if (userType === 'buyer') {
            await connection.execute(
                `INSERT INTO Buyer(PhoneNumber, Budget) VALUES (:phoneNumber, 0)`,
                [phoneNumber],
                { autoCommit: false }
            );
        }
        
        await connection.commit();
        return true;
    }).catch(() => {
        return false;
    });
}

async function fetchPropertyAddresses() {
    return await withOracleDB(async (connection) => {
        try {
            const result = await connection.execute(`
                SELECT DISTINCT Address 
                FROM Property 
                ORDER BY Address
            `);
            return result.rows;
        } catch (error) {
            console.error('Database error in fetchPropertyAddresses:', error);
            throw error;
        }
    });
}

//Helper functions for selection query
async function selectViewings(selectWhere) {

    const queryConditions = [];
    const bindValues = {}
    selectWhere.forEach((condition, index) => {
        const key = `value${index}`
        if(condition.logic) {
            queryConditions.push(`${condition.logic} ${condition.field} ${condition.operator} :${key}`)
        } else {
            queryConditions.push(`${condition.field} ${condition.operator} :${key}`)
        }
        bindValues[key] = condition.value;
    })

    const selectQuery = `SELECT * FROM ViewingHas
    WHERE ${queryConditions.join(' ')}`;

    return await withOracleDB(async (connection) => {
        const result = await connection.execute(selectQuery, bindValues);
        const headers = result.metaData.map((column) => column.name);
        return {"headers": headers, "rows": result.rows};
    }).catch(() => {
        return false;
    });

}


// //Helper functions for projection query
async function selectViewingCols(selectedCols) {
    const query = `SELECT ${selectedCols.join(", ")} FROM ViewingHas`;
    
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            query
        );
        const headers = result.metaData.map((column) => column.name);
        return {"headers": headers, "rows": result.rows};
    }).catch(() => {
        return false;
    });
}

//Helper functions for join query
async function selectPropertyManages(joinWhere) {
    const queryConditions = [];
    const bindValues = {}
    joinWhere.forEach((condition, index) => {
        const key = `value${index}`
        if(condition.logic) {
            queryConditions.push(`${condition.logic} ${condition.field} ${condition.operator} :${key}`)
        } else {
            queryConditions.push(`${condition.field} ${condition.operator} :${key}`)
        }

        if(condition.field === "P.ListingPrice" || condition.field === "P.PropertySize") {
            bindValues[key] = Number(condition.value);
        } else {
            bindValues[key] = condition.value;
        }
        
    })

    //const query = `SELECT * FROM Property P, Manages M WHERE P.PostalCode = M.PostalCode AND P.Address = M.Address AND P.ListingDate = M.ListingDate AND ${joinwhere}`;
    //const joinquery = `SELECT M.AgencyName, P.Address, P.PostalCode, P.ListingDate, P.ListingPrice, P.PropertySize, P.ImagesLink FROM Property P, Manages M WHERE P.PostalCode = M.PostalCode AND P.Address = M.Address AND P.ListingDate = M.ListingDate AND ${joinwhere}`;
    const joinQuery = `SELECT M.AgencyName, P.Address, P.PostalCode, P.ListingDate, P.ListingPrice, P.PropertySize, 
    P.ImagesLink 
    FROM Property P 
    JOIN Manages M ON P.PostalCode = M.PostalCode 
    AND P.Address = M.Address AND 
    P.ListingDate = M.ListingDate WHERE ${queryConditions.join(' ')}`;

    return await withOracleDB(async (connection) => {
        const result = await connection.execute(joinQuery, bindValues);
        return {"rows": result.rows}
    })
}

module.exports = {
    testOracleConnection,
    fetchDemotableFromDb,
    fetchClientTableFromDb,
    fetchViewingTableFromDb,
    insertDemotable, 
    insertCommercialType,
    insertCommercial,
    insertOwns,
    insertResidential,
    updateNameDemotable,
    havingProperties,
    groupByProperties,
    nestedAggregation,
    validateAgent,
    validateBuyer,
    validateOwner,
    registerNewUser,
    fetchPropertyAddresses,
    updateEmailDemotable,
    updateAgentIDDemotable,
    updateAdressDemotable,
    deleteViewing,
    division_query,
    deleteWrongOwns,
    selectViewings,
    selectViewingCols,
    selectPropertyManages,
    fetchAllViewingsTableFromDb
};