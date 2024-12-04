--Drop statements to allow script to be rerun
DROP TABLE Owner CASCADE CONSTRAINTS;
DROP TABLE Buyer CASCADE CONSTRAINTS;
DROP TABLE Agency CASCADE CONSTRAINTS;
DROP TABLE Property CASCADE CONSTRAINTS;
DROP TABLE Commercial CASCADE CONSTRAINTS;
DROP TABLE CommercialType CASCADE CONSTRAINTS;
DROP TABLE Residential CASCADE CONSTRAINTS;
DROP TABLE SaleAgreementAppliesTo CASCADE CONSTRAINTS;
DROP TABLE PaymentSettles CASCADE CONSTRAINTS;
DROP TABLE ViewingHas CASCADE CONSTRAINTS;
DROP TABLE Inspection CASCADE CONSTRAINTS;
DROP TABLE AgentEmploys CASCADE CONSTRAINTS;
DROP TABLE ClientHires CASCADE CONSTRAINTS;
DROP TABLE Holds CASCADE CONSTRAINTS;
DROP TABLE Manages CASCADE CONSTRAINTS;
DROP TABLE EntersInto CASCADE CONSTRAINTS;
DROP TABLE Attends CASCADE CONSTRAINTS;
DROP TABLE Assesses CASCADE CONSTRAINTS;
DROP TABLE Owns CASCADE CONSTRAINTS;

--Create statements for each Table, taken from milestone 2


CREATE TABLE Agency
(
    Name        VARCHAR(100),
    PhoneNumber VARCHAR(15),
    PRIMARY KEY (Name)
);

-- PLEASE NOTE: Property ISA either a Commercial or Residential. This ISA is total and disjoint, these two constraints could not be specified in Oracle but are enforced
-- by the way a user is permitted to add a property, they must specifify only one of Residential or Commercial. 
CREATE TABLE Property
(
    Address      VARCHAR(255),
    PostalCode   VARCHAR(150),
    ListingDate  VARCHAR(150),
    ListingPrice DECIMAL(15, 2),
    PropertySize DECIMAL(15, 2),
    ImagesLink   VARCHAR(255),
    PRIMARY KEY (Address, PostalCode, ListingDate)
);

CREATE TABLE CommercialType
(
    Type    VARCHAR(100),
    Licence VARCHAR(50),
    PRIMARY KEY (Licence)
);

CREATE TABLE Commercial
(
    Address     VARCHAR(255),
    PostalCode  VARCHAR(150),
    ListingDate VARCHAR(150),
    Licence VARCHAR(50),
    PRIMARY KEY (Address, PostalCode, ListingDate),
    FOREIGN KEY (Address, PostalCode, ListingDate) REFERENCES Property (Address, PostalCode, ListingDate) ON DELETE CASCADE,
    FOREIGN KEY (Licence) REFERENCES CommercialType (Licence) ON DELETE CASCADE
);

CREATE TABLE Residential
(
    Address     VARCHAR(255),
    PostalCode  VARCHAR(150),
    ListingDate VARCHAR(150),
    Bathrooms   INT,
    Bedrooms    INT,
    PRIMARY KEY (Address, PostalCode, ListingDate),
    FOREIGN KEY (Address, PostalCode, ListingDate) REFERENCES Property (Address, PostalCode, ListingDate) ON DELETE CASCADE
);

CREATE TABLE SaleAgreementAppliesTo
(
    SalePrice          DECIMAL(10, 2),
    TermsAndConditions CLOB,
    Status             VARCHAR(50),
    AgreementID        INT,
    Address            VARCHAR(255) NOT NULL,
    PostalCode         VARCHAR(10) NOT NULL,
    ListingDate        VARCHAR(150)        NOT NULL,
    PRIMARY KEY (AgreementID),
    FOREIGN KEY (Address, PostalCode, ListingDate) REFERENCES Property (Address, PostalCode, ListingDate)  ON DELETE CASCADE
);

CREATE TABLE PaymentSettles
(
    PaymentID     INT,
    PaymentDate   VARCHAR(25),
    Amount        DECIMAL(10, 2),
    PaymentMethod VARCHAR(50),
    AgreementID   INT NOT NULL,
    PRIMARY KEY (PaymentID),
    FOREIGN KEY (AgreementID) REFERENCES SaleAgreementAppliesTo (AgreementID)
);

CREATE TABLE ViewingHas
(
    Time        VARCHAR(10),
    ViewingDate VARCHAR(25),
    Address     VARCHAR(255) NOT NULL,
    PostalCode  VARCHAR(150)  NOT NULL,
    ListingDate VARCHAR(150)         NOT NULL,
    PRIMARY KEY (Time, ViewingDate),
    FOREIGN KEY (Address, PostalCode, ListingDate) REFERENCES Property (Address, PostalCode, ListingDate)  ON DELETE CASCADE
);

CREATE TABLE Inspection
(
    InspectionID     INT,
    InspectionDate   VARCHAR(25),
    InspectionType   VARCHAR(100),
    InspectorName    VARCHAR(100),
    InspectionStatus VARCHAR(50),
    PRIMARY KEY (InspectionID)
);

CREATE TABLE AgentEmploys
(
    AgentID     INT,
    Name        VARCHAR(100),
    PhoneNumber VARCHAR(15),
    Email       VARCHAR(100),
    Commission  DECIMAL(10, 2),
    AgencyName  VARCHAR(100),
    PRIMARY KEY (AgentID),
    FOREIGN KEY (AgencyName) REFERENCES Agency (Name)
);

-- PLEASE NOTE: Oracle does not support ON UPDATE, we are aware that in the ClientHires table the foreign key AgentID should be updated on cascade. 
CREATE TABLE ClientHires
(
    Name              VARCHAR(100),
    Address           VARCHAR(255),
    Email             VARCHAR(100),
    PhoneNumber       VARCHAR(15),
    AgentID           INT,
    PRIMARY KEY (PhoneNumber),
    FOREIGN KEY (AgentID) REFERENCES AgentEmploys (AgentID)
);

CREATE TABLE Owner
(
    PhoneNumber VARCHAR(15),
    MinBudget   DECIMAL(10, 2),
    PRIMARY KEY (PhoneNumber),
    FOREIGN KEY (PhoneNumber) REFERENCES ClientHires(PhoneNumber)
);

CREATE TABLE Buyer
(
    PhoneNumber VARCHAR(15),
    Budget      DECIMAL(10, 2),
    PRIMARY KEY (PhoneNumber),
    FOREIGN KEY (PhoneNumber) REFERENCES ClientHires(PhoneNumber)
);

CREATE TABLE Holds
(
    AgentID INT,
    Time     VARCHAR(10),
    ViewingDate    VARCHAR(25),
    PRIMARY KEY (AgentID, Time, ViewingDate),
    FOREIGN KEY (AgentID) REFERENCES AgentEmploys (AgentID),
    FOREIGN KEY (Time, ViewingDate) REFERENCES ViewingHas (Time, ViewingDate)
);

CREATE TABLE Manages
(
    AgencyName  VARCHAR(100),
    ListingDate VARCHAR(150),
    PostalCode  VARCHAR(150),
    Address     VARCHAR(255),
    PRIMARY KEY (AgencyName, ListingDate, PostalCode, Address),
    FOREIGN KEY (AgencyName) REFERENCES Agency (Name),
    FOREIGN KEY (PostalCode, ListingDate, Address) REFERENCES Property (PostalCode,
                                                                        ListingDate, Address)  ON DELETE CASCADE
);

CREATE TABLE EntersInto
(
    BuyerPhoneNumber VARCHAR(15),
    AgreementID      INT,
    PRIMARY KEY (AgreementID, BuyerPhoneNumber),
    FOREIGN KEY (BuyerPhoneNumber) REFERENCES Buyer (PhoneNumber),
    FOREIGN KEY (AgreementID) REFERENCES SaleAgreementAppliesTo (AgreementID)
);

CREATE TABLE Attends
(
    BuyerPhoneNumber VARCHAR(15),
    Time              VARCHAR(10),
    ViewingDate      VARCHAR(25),
    PRIMARY KEY (BuyerPhoneNumber, ViewingDate, Time),
    FOREIGN KEY (BuyerPhoneNumber) REFERENCES Buyer (PhoneNumber),
    FOREIGN KEY (Time, ViewingDate) REFERENCES ViewingHas (Time, ViewingDate)
);

CREATE TABLE Assesses
(
    InspectionID INT,
    Address      VARCHAR(255),
    PostalCode   VARCHAR(150),
    ListingDate  VARCHAR(150),
    PRIMARY KEY (InspectionID, Address, PostalCode, ListingDate),
    FOREIGN KEY (InspectionID) REFERENCES Inspection (InspectionID),
    FOREIGN KEY (Address, PostalCode, ListingDate) REFERENCES Property (Address,
                                                                        PostalCode, ListingDate)  ON DELETE CASCADE
);

CREATE TABLE Owns
(
    OwnerPhoneNumber VARCHAR(15),
    Address VARCHAR(255),
    PostalCode       VARCHAR(150),
    ListingDate      VARCHAR(150),
    PRIMARY KEY (OwnerPhoneNumber, Address, PostalCode, ListingDate),
    FOREIGN KEY (OwnerPhoneNumber) REFERENCES Owner (PhoneNumber),
    FOREIGN KEY (Address, PostalCode, ListingDate) REFERENCES Property (Address,
                                                                        PostalCode, ListingDate)  ON DELETE CASCADE
);

INSERT INTO Agency (Name, PhoneNumber) VALUES ('Star Realty', '6041234567');
INSERT INTO Agency (Name, PhoneNumber) VALUES ('Top Choice Real Estate', '7789876543');
INSERT INTO Agency (Name, PhoneNumber) VALUES ('Prime Properties', '6045551234');
INSERT INTO Agency (Name, PhoneNumber) VALUES ('Luxury Homes', '7784445555');
INSERT INTO Agency (Name, PhoneNumber) VALUES ('Dream Homes Agency', '6047778888');

INSERT INTO Property (Address, PostalCode, ListingDate, ListingPrice, PropertySize, ImagesLink) VALUES ('123 Elm St', 'V1A2B3',  '2024-10-01', 350000.00, 1200.00, 'link_to_image1.jpg');
INSERT INTO Property (Address, PostalCode, ListingDate, ListingPrice, PropertySize, ImagesLink) VALUES ('456 Oak St', 'V2B3C4',  '2024-09-15', 500000.00, 1500.00, 'link_to_image2.jpg');
INSERT INTO Property (Address, PostalCode, ListingDate, ListingPrice, PropertySize, ImagesLink) VALUES ('789 Pine St', 'V3C4D5',  '2024-08-20', 400000.00, 900.00, 'link_to_image3.jpg');
INSERT INTO Property (Address, PostalCode, ListingDate, ListingPrice, PropertySize, ImagesLink) VALUES ('321 Birch St', 'V4D5E6',  '2024-07-05', 600000.00, 1800.00, 'link_to_image4.jpg');
INSERT INTO Property (Address, PostalCode, ListingDate, ListingPrice, PropertySize, ImagesLink) VALUES ('654 Maple St', 'V5E6F7',  '2024-06-10', 250000.00, 900.00, 'link_to_image5.jpg');
INSERT INTO Property (Address, PostalCode, ListingDate, ListingPrice, PropertySize, ImagesLink) VALUES ('987 Cedar St', 'V6F7G8',  '2024-05-01', 300000.00, 1200.00, 'link_to_image6.jpg');
INSERT INTO Property (Address, PostalCode, ListingDate, ListingPrice, PropertySize, ImagesLink) VALUES ('222 Spruce Ln', 'V7G8H9',  '2024-04-10', 350000.00, 1250.00, 'link_to_image7.jpg');
INSERT INTO Property (Address, PostalCode, ListingDate, ListingPrice, PropertySize, ImagesLink) VALUES ('333 Fir Rd', 'V8H9I0',  '2024-03-20', 350000.00, 1400.00, 'link_to_image8.jpg');
INSERT INTO Property (Address, PostalCode, ListingDate, ListingPrice, PropertySize, ImagesLink) VALUES ('444 Willow Ct', 'V9I0J1',  '2024-02-15', 500000.00, 1500.00, 'link_to_image9.jpg');
INSERT INTO Property (Address, PostalCode, ListingDate, ListingPrice, PropertySize, ImagesLink) VALUES ('555 Alder Cir', 'V0J1K2',  '2024-01-30', 600000.00, 1600.00, 'link_to_image10.jpg');
INSERT INTO Property (Address, PostalCode, ListingDate, ListingPrice, PropertySize, ImagesLink) VALUES ('431 Alder Cir', 'V0J1K2',  '2024-01-20', 600000.00, 1600.00, 'link_to_image10.jpg');
INSERT INTO Property (Address, PostalCode, ListingDate, ListingPrice, PropertySize, ImagesLink) VALUES ('32 Dove Dr', 'V0J1K2',  '2024-05-30', 730000.00, 1600.00, 'link_to_image10.jpg');
INSERT INTO Property (Address, PostalCode, ListingDate, ListingPrice, PropertySize, ImagesLink) VALUES ('324 10th Ave', 'V0J1K2',  '2023-01-30', 640000.00, 1600.00, 'link_to_image10.jpg');
INSERT INTO Property (Address, PostalCode, ListingDate, ListingPrice, PropertySize, ImagesLink) VALUES ('325 6th St', 'V0J1K2',  '2022-01-30', 520000.00, 1500.00, 'link_to_image10.jpg');
INSERT INTO Property (Address, PostalCode, ListingDate, ListingPrice, PropertySize, ImagesLink) VALUES ('32 Forest Cir', 'V0J1K2',  '2024-01-21', 630000.00, 1500.00, 'link_to_image10.jpg');

INSERT INTO CommercialType (Type, Licence) VALUES ('Retail', 'LIC123456');
INSERT INTO CommercialType (Type, Licence) VALUES ('Office', 'LIC234567');
INSERT INTO CommercialType (Type, Licence) VALUES ('Warehouse', 'LIC345678');
INSERT INTO CommercialType (Type, Licence) VALUES ('Industrial', 'LIC456789');
INSERT INTO CommercialType (Type, Licence) VALUES ('Food Service', 'LIC567890');
INSERT INTO CommercialType (Type, Licence) VALUES ('Food Service', 'LIC562800');
INSERT INTO CommercialType (Type, Licence) VALUES ('Food Service', 'LIC564290');
INSERT INTO CommercialType (Type, Licence) VALUES ('Food Service', 'LIC567824');

INSERT INTO Commercial (Address, PostalCode, ListingDate, Licence) VALUES ('123 Elm St', 'V1A2B3', '2024-10-01', 'LIC123456');
INSERT INTO Commercial (Address, PostalCode, ListingDate, Licence) VALUES ('456 Oak St', 'V2B3C4',  '2024-09-15', 'LIC234567');
INSERT INTO Commercial (Address, PostalCode, ListingDate, Licence) VALUES ('789 Pine St', 'V3C4D5', '2024-08-20', 'LIC345678');
INSERT INTO Commercial (Address, PostalCode, ListingDate, Licence) VALUES ('321 Birch St', 'V4D5E6',  '2024-07-05', 'LIC456789');
INSERT INTO Commercial (Address, PostalCode, ListingDate, Licence) VALUES ('654 Maple St', 'V5E6F7',  '2024-06-10', 'LIC567890');
INSERT INTO Commercial (Address, PostalCode, ListingDate, Licence) VALUES ('431 Alder Cir', 'V0J1K2',  '2024-01-20', 'LIC562800');
INSERT INTO Commercial (Address, PostalCode, ListingDate, Licence) VALUES ('32 Dove Dr', 'V0J1K2',  '2024-05-30', 'LIC564290');
INSERT INTO Commercial (Address, PostalCode, ListingDate, Licence) VALUES ('324 10th Ave', 'V0J1K2',  '2023-01-30', 'LIC567824');

INSERT INTO Residential (Address, PostalCode, ListingDate, Bathrooms, Bedrooms) VALUES ('987 Cedar St', 'V6F7G8',  '2024-05-01', 2, 3);
INSERT INTO Residential (Address, PostalCode, ListingDate, Bathrooms, Bedrooms) VALUES ('444 Willow Ct', 'V9I0J1',  '2024-02-15', 3, 4);
INSERT INTO Residential (Address, PostalCode, ListingDate, Bathrooms, Bedrooms) VALUES ('333 Fir Rd', 'V8H9I0',  '2024-03-20', 1, 2);
INSERT INTO Residential (Address, PostalCode, ListingDate, Bathrooms, Bedrooms) VALUES ('222 Spruce Ln', 'V7G8H9',  '2024-04-10', 2, 3);
INSERT INTO Residential (Address, PostalCode, ListingDate, Bathrooms, Bedrooms) VALUES ('555 Alder Cir', 'V0J1K2',  '2024-01-30', 2, 5);
INSERT INTO Residential (Address, PostalCode, ListingDate, Bathrooms, Bedrooms) VALUES ('325 6th St', 'V0J1K2',  '2022-01-30', 4, 3);
INSERT INTO Residential (Address, PostalCode, ListingDate, Bathrooms, Bedrooms) VALUES ('32 Forest Cir', 'V0J1K2',  '2024-01-21', 1, 2);

INSERT INTO SaleAgreementAppliesTo (SalePrice, TermsAndConditions, Status, AgreementID, Address, PostalCode, ListingDate) VALUES (350000.00, 'Standard terms apply', 'Pending', 1001, '123 Elm St', 'V1A2B3',  '2024-10-01');
INSERT INTO SaleAgreementAppliesTo (SalePrice, TermsAndConditions, Status, AgreementID, Address, PostalCode, ListingDate) VALUES (500000.00, 'Standard terms apply', 'Completed', 1002, '456 Oak St', 'V2B3C4',  '2024-09-15');
INSERT INTO SaleAgreementAppliesTo (SalePrice, TermsAndConditions, Status, AgreementID, Address, PostalCode, ListingDate) VALUES (400000.00, 'Standard terms apply', 'Pending', 1003, '789 Pine St', 'V3C4D5',  '2024-08-20');
INSERT INTO SaleAgreementAppliesTo (SalePrice, TermsAndConditions, Status, AgreementID, Address, PostalCode, ListingDate) VALUES (600000.00, 'Standard terms apply', 'Completed', 1004, '321 Birch St', 'V4D5E6',  '2024-07-05');
INSERT INTO SaleAgreementAppliesTo (SalePrice, TermsAndConditions, Status, AgreementID, Address, PostalCode, ListingDate) VALUES (250000.00, 'Standard terms apply', 'Pending', 1005, '654 Maple St', 'V5E6F7', '2024-06-10');
INSERT INTO SaleAgreementAppliesTo (SalePrice, TermsAndConditions, Status, AgreementID, Address, PostalCode, ListingDate) VALUES (650000.00, 'Standard terms apply', 'Completed', 1006, '431 Alder Cir', 'V0J1K2',  '2024-01-20');
INSERT INTO SaleAgreementAppliesTo (SalePrice, TermsAndConditions, Status, AgreementID, Address, PostalCode, ListingDate) VALUES (730000.00, 'Standard terms apply', 'Completed', 1007, '32 Dove Dr', 'V0J1K2',  '2024-05-30');
INSERT INTO SaleAgreementAppliesTo (SalePrice, TermsAndConditions, Status, AgreementID, Address, PostalCode, ListingDate) VALUES (640000.00, 'Standard terms apply', 'Completed', 1008, '324 10th Ave', 'V0J1K2',  '2023-01-30');

INSERT INTO PaymentSettles (PaymentID, PaymentDate, Amount, PaymentMethod, AgreementID) VALUES (001,  '2024-10-15', 300000.00, 'Bank Transfer', 1001);
INSERT INTO PaymentSettles (PaymentID, PaymentDate, Amount, PaymentMethod, AgreementID) VALUES (002,  '2024-09-30', 500000.00, 'Cheque', 1002);
INSERT INTO PaymentSettles (PaymentID, PaymentDate, Amount, PaymentMethod, AgreementID) VALUES (003,  '2024-09-05', 300000.00, 'Credit Card', 1003);
INSERT INTO PaymentSettles (PaymentID, PaymentDate, Amount, PaymentMethod, AgreementID) VALUES (004,  '2024-07-20', 600000.00, 'Cash', 1004);
INSERT INTO PaymentSettles (PaymentID, PaymentDate, Amount, PaymentMethod, AgreementID) VALUES (005,  '2024-06-25', 200000.00, 'Bank Transfer', 1005);
INSERT INTO PaymentSettles (PaymentID, PaymentDate, Amount, PaymentMethod, AgreementID) VALUES (006,  '2024-06-25', 100000.00, 'Bank Transfer', 1007);  
INSERT INTO PaymentSettles (PaymentID, PaymentDate, Amount, PaymentMethod, AgreementID) VALUES (007,  '2024-06-25', 100000.00, 'Credit Card', 1005);
INSERT INTO PaymentSettles (PaymentID, PaymentDate, Amount, PaymentMethod, AgreementID) VALUES (008,  '2024-06-25', 150000.00, 'Bank Transfer', 1005);
INSERT INTO PaymentSettles (PaymentID, PaymentDate, Amount, PaymentMethod, AgreementID) VALUES (009,  '2024-06-25', 350000.00, 'Bank Transfer', 1006);
INSERT INTO PaymentSettles (PaymentID, PaymentDate, Amount, PaymentMethod, AgreementID) VALUES (010,  '2024-06-25', 200000.00, 'Cheque', 1006);
INSERT INTO PaymentSettles (PaymentID, PaymentDate, Amount, PaymentMethod, AgreementID) VALUES (011,  '2024-06-25', 630000.00, 'Bank Transfer', 1007);
INSERT INTO PaymentSettles (PaymentID, PaymentDate, Amount, PaymentMethod, AgreementID) VALUES (012,  '2024-06-25', 320000.00, 'Cheque', 1008);
INSERT INTO PaymentSettles (PaymentID, PaymentDate, Amount, PaymentMethod, AgreementID) VALUES (013,  '2024-06-25', 320000.00, 'Credit Card', 1008);

INSERT INTO ViewingHas (Time, ViewingDate, Address, PostalCode, ListingDate) VALUES ( '10.00',  '2024-10-05', '123 Elm St', 'V1A2B3',  '2024-10-01');
INSERT INTO ViewingHas (Time, ViewingDate, Address, PostalCode, ListingDate) VALUES ( '11.30',  '2024-09-20', '456 Oak St', 'V2B3C4',  '2024-09-15');
INSERT INTO ViewingHas (Time, ViewingDate, Address, PostalCode, ListingDate) VALUES ( '14.00',  '2024-08-25', '789 Pine St', 'V3C4D5',  '2024-08-20');
INSERT INTO ViewingHas (Time, ViewingDate, Address, PostalCode, ListingDate) VALUES ( '15.30',  '2024-07-10', '321 Birch St', 'V4D5E6',  '2024-07-05');
INSERT INTO ViewingHas (Time, ViewingDate, Address, PostalCode, ListingDate) VALUES ( '09.00',  '2024-06-12', '654 Maple St', 'V5E6F7',  '2024-06-10');

INSERT INTO Inspection (InspectionID, InspectionDate, InspectionType, InspectorName, InspectionStatus) VALUES (1,  '2024-10-10', 'General', 'Alice Cooper', 'Completed');
INSERT INTO Inspection (InspectionID, InspectionDate, InspectionType, InspectorName, InspectionStatus) VALUES (2,  '2024-09-25', 'Structural', 'Bob Smith', 'Completed');
INSERT INTO Inspection (InspectionID, InspectionDate, InspectionType, InspectorName, InspectionStatus) VALUES (3,  '2024-08-30', 'Pest', 'Charlie Johnson', 'Pending');
INSERT INTO Inspection (InspectionID, InspectionDate, InspectionType, InspectorName, InspectionStatus) VALUES (4,  '2024-07-15', 'Electrical', 'Diana Prince', 'Completed');
INSERT INTO Inspection (InspectionID, InspectionDate, InspectionType, InspectorName, InspectionStatus) VALUES (5,  '2024-06-18', 'Plumbing', 'Ethan Hunt', 'Pending');

INSERT INTO AgentEmploys(AgentID, Name, PhoneNumber, Email, Commission, AgencyName) VALUES (101, 'John Smith', '6041234561', 'john.smith@starrealty.com', 0.05, 'Star Realty');
INSERT INTO AgentEmploys(AgentID, Name, PhoneNumber, Email, Commission, AgencyName) VALUES (102, 'Emma Wilson', '7789876541', 'emma.wilson@topchoicerealestate.com', 0.04, 'Top Choice Real Estate');
INSERT INTO AgentEmploys(AgentID, Name, PhoneNumber, Email, Commission, AgencyName) VALUES (103, 'Michael Brown', '6045551231', 'michael.brown@primeproperties.com', 0.06, 'Prime Properties');
INSERT INTO AgentEmploys(AgentID, Name, PhoneNumber, Email, Commission, AgencyName) VALUES (104, 'Sophia Davis', '7784445551', 'sophia.davis@luxuryhomes.com', 0.05, 'Luxury Homes');
INSERT INTO AgentEmploys(AgentID, Name, PhoneNumber, Email, Commission, AgencyName) VALUES (105, 'David Lee', '6047778881', 'david.lee@dreamhomesagency.com', 0.03, 'Dream Homes Agency');

INSERT INTO ClientHires(Name, Address, Email, PhoneNumber, AgentID) VALUES ('Dylan Brown', '163 Birch Ave', 'dylan.brown@gmail.com', '6048881234', 101);
INSERT INTO ClientHires(Name, Address, Email, PhoneNumber, AgentID) VALUES ('Ishmael Davis', '252 Arbutus St', 'i.davis@gmail.com', '7789995555', 102);
INSERT INTO ClientHires(Name, Address, Email, PhoneNumber, AgentID) VALUES ('Stephanie Lopez', '34 West Lake Dr.', 'stephanieLopez@gmail,com', '6043337777', 103);
INSERT INTO ClientHires(Name, Address, Email, PhoneNumber, AgentID) VALUES ('Missy Rowan', '3482 9th Ave', 'missy.rowen@gmail.com', '7781234567', 104);
INSERT INTO ClientHires(Name, Address, Email, PhoneNumber, AgentID) VALUES ('Michael Reyna', '3243 10th St', 'michael.reyna@gmail.com','6047778888', 105);
INSERT INTO ClientHires(Name, Address, Email, PhoneNumber, AgentID) VALUES ('Isabela Gross', '3413 Poppy Lane', 'isabella.gross@gmail.com','6042223333', 101);
INSERT INTO ClientHires(Name, Address, Email, PhoneNumber, AgentID) VALUES ('Xavier Burns', '2340 Blackbird Dr.', 'xavier.burns@gmail.com','7784445555', 102);
INSERT INTO ClientHires(Name, Address, Email, PhoneNumber, AgentID) VALUES ('Amias McKay', '2342 Mission St.', 'amias.mckay@gmail','6045554444', 103);
INSERT INTO ClientHires(Name, Address, Email, PhoneNumber, AgentID) VALUES ('Antonia Wallace', '3251 Langara Rd.', 'antonia.wallace@gmail.com','7786665555', 104);
INSERT INTO ClientHires(Name, Address, Email, PhoneNumber, AgentID) VALUES ('Lia Grant', '2341 W 10th Ave', 'lia.grant@gmail.com','6047776666', 105);
INSERT INTO ClientHires(Name, Address, Email, PhoneNumber, AgentID) VALUES ('Sylvia Grant', '2341 W 10th Ave', 'sylvia.grant@gmail.com','6044326666', 101);
INSERT INTO ClientHires(Name, Address, Email, PhoneNumber, AgentID) VALUES ('Dennis Graff', '2231 W 6th Ave', 'dennis.graff@gmail.com','6048234666', 102);
INSERT INTO ClientHires(Name, Address, Email, PhoneNumber, AgentID) VALUES ('Martha Smith', '8234 W 7th Ave', 'martha.smith@gmail.com','6047433661', 103);


INSERT INTO Owner (PhoneNumber, MinBudget) VALUES ('6048881234', 300000.00);
INSERT INTO Owner (PhoneNumber, MinBudget) VALUES ('7789995555', 500000.00);
INSERT INTO Owner (PhoneNumber, MinBudget) VALUES ('6043337777', 400000.00);
INSERT INTO Owner (PhoneNumber, MinBudget) VALUES ('7781234567', 600000.00);
INSERT INTO Owner (PhoneNumber, MinBudget) VALUES ('6047778888', 250000.00);

INSERT INTO Buyer (PhoneNumber, Budget) VALUES ('6042223333', 700000.00);
INSERT INTO Buyer (PhoneNumber, Budget) VALUES ('7784445555', 800000.00);
INSERT INTO Buyer (PhoneNumber, Budget) VALUES ('6045554444', 500000.00);
INSERT INTO Buyer (PhoneNumber, Budget) VALUES ('7786665555', 600000.00);
INSERT INTO Buyer (PhoneNumber, Budget) VALUES ('6047776666', 900000.00);
INSERT INTO Buyer (PhoneNumber, Budget) VALUES ('6044326666', 800000.00);
INSERT INTO Buyer (PhoneNumber, Budget) VALUES ('6048234666', 750000.00);
INSERT INTO Buyer (PhoneNumber, Budget) VALUES ('6047433661', 620000.00);

INSERT INTO Holds(AgentID, Time, ViewingDate) VALUES (101,  '10.00',  '2024-10-05');
INSERT INTO Holds(AgentID, Time, ViewingDate) VALUES (102,  '11.30',  '2024-09-20');
INSERT INTO Holds(AgentID, Time, ViewingDate) VALUES (103,  '14.00',  '2024-08-25');
INSERT INTO Holds(AgentID, Time, ViewingDate) VALUES (104,  '15.30',  '2024-07-10');
INSERT INTO Holds(AgentID, Time, ViewingDate) VALUES (105,  '09.00',  '2024-06-12');

INSERT INTO Manages(AgencyName, Address, PostalCode, ListingDate) VALUES ('Star Realty', '123 Elm St', 'V1A2B3',  '2024-10-01');
INSERT INTO Manages(AgencyName, Address, PostalCode, ListingDate) VALUES ('Top Choice Real Estate', '456 Oak St', 'V2B3C4',  '2024-09-15');
INSERT INTO Manages(AgencyName, Address, PostalCode, ListingDate) VALUES ('Prime Properties', '789 Pine St', 'V3C4D5',  '2024-08-20');
INSERT INTO Manages(AgencyName, Address, PostalCode, ListingDate) VALUES ('Luxury Homes', '321 Birch St', 'V4D5E6',  '2024-07-05');
INSERT INTO Manages(AgencyName, Address, PostalCode, ListingDate) VALUES ('Dream Homes Agency', '654 Maple St', 'V5E6F7',  '2024-06-10');

INSERT INTO EntersInto(BuyerPhoneNumber, AgreementID) VALUES ('6042223333', 1001);
INSERT INTO EntersInto(BuyerPhoneNumber, AgreementID) VALUES ('7784445555', 1002);
INSERT INTO EntersInto(BuyerPhoneNumber, AgreementID) VALUES ('6045554444', 1003);
INSERT INTO EntersInto(BuyerPhoneNumber, AgreementID) VALUES ('7786665555', 1004);
INSERT INTO EntersInto(BuyerPhoneNumber, AgreementID) VALUES ('6047776666', 1005);
INSERT INTO EntersInto(BuyerPhoneNumber, AgreementID) VALUES ('6044326666', 1006);
INSERT INTO EntersInto(BuyerPhoneNumber, AgreementID) VALUES ('6048234666', 1007);
INSERT INTO EntersInto(BuyerPhoneNumber, AgreementID) VALUES ('6047433661', 1008);

INSERT INTO Attends(BuyerPhoneNumber, Time, ViewingDate) VALUES ('6042223333',  '10.00',  '2024-10-05');
INSERT INTO Attends(BuyerPhoneNumber, Time, ViewingDate) VALUES ('7784445555',  '11.30',  '2024-09-20');
INSERT INTO Attends(BuyerPhoneNumber, Time, ViewingDate) VALUES ('6045554444',  '14.00',  '2024-08-25');
INSERT INTO Attends(BuyerPhoneNumber, Time, ViewingDate) VALUES ('7786665555',  '15.30',  '2024-07-10');
INSERT INTO Attends(BuyerPhoneNumber, Time, ViewingDate) VALUES ('6047776666',  '09.00',  '2024-06-12');

INSERT INTO Assesses(InspectionID, Address, PostalCode, ListingDate) VALUES (1, '456 Oak St', 'V2B3C4',  '2024-09-15');
INSERT INTO Assesses(InspectionID, Address, PostalCode, ListingDate) VALUES (2, '789 Pine St', 'V3C4D5',  '2024-08-20');
INSERT INTO Assesses(InspectionID, Address, PostalCode, ListingDate) VALUES (3, '321 Birch St', 'V4D5E6',  '2024-07-05');
INSERT INTO Assesses(InspectionID, Address, PostalCode, ListingDate) VALUES (4, '654 Maple St', 'V5E6F7',  '2024-06-10');
INSERT INTO Assesses(InspectionID, Address, PostalCode, ListingDate) VALUES (5, '987 Cedar St', 'V6F7G8',  '2024-05-01');

INSERT INTO Owns(OwnerPhoneNumber, PostalCode, ListingDate, Address) VALUES ('6048881234', 'V1A2B3',  '2024-10-01', '123 Elm St');
INSERT INTO Owns(OwnerPhoneNumber, PostalCode, ListingDate, Address) VALUES ('7789995555', 'V2B3C4',  '2024-09-15', '456 Oak St');
INSERT INTO Owns(OwnerPhoneNumber, PostalCode, ListingDate, Address) VALUES ('6043337777', 'V3C4D5',  '2024-08-20', '789 Pine St');
INSERT INTO Owns(OwnerPhoneNumber, PostalCode, ListingDate, Address) VALUES ('7781234567', 'V4D5E6',  '2024-07-05', '321 Birch St');
INSERT INTO Owns(OwnerPhoneNumber, PostalCode, ListingDate, Address) VALUES ('6047778888', 'V5E6F7',  '2024-06-10', '654 Maple St');