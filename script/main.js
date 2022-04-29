// Constant Data
let data = [
    {
        name: "Nasi Goreng",
        price: 25_000,
        qty: 1
    },
    {
        name: "Gado Gado",
        price: 20_000,
        qty: 1
    },
    {
        name: "Pecel Lele",
        price: 28_000,
        qty: 1
    },
    {
        name: "Mie Bakso",
        price: 25_000,
        qty: 1
    }
]

/**
 * Set different onclick function for different button   
 */
function setAttrBtn() {
    const btn = document.getElementsByClassName('addToCart-btn')
    for (let i = 0; i < btn.length; i++) {
        btn[i].onclick = function() { addItem(i) }
    }
}

/**
 * @returns {object[]}
 */
function getLSItem() {
    const data = JSON.parse(localStorage.getItem("prodInputted"));
    return data || [];
} 

function LSChecker({ name, price, qty }) {
    const existingData = getLSItem();
    const paramObj = {
        name: name,
        price: price,
        qty: qty
    }
    if (existingData.length) {
        for (let i = 0; i < existingData.length; i++) {
            if(JSON.stringify(existingData[i].name) == JSON.stringify(paramObj.name)) {   
                return true;
            }
        }
    }
    return false;
}

/**
 * @returns {modified object[] without adding index}
 */
function LSModifier({ name, price, qty }) {
    const existingData = getLSItem();
    let modifiedObj = {
        name: name,
        price: price,
        qty: qty
    }
    console.log(modifiedObj)
    for (let i = 0; i < existingData.length; i++) {
        if(JSON.stringify(existingData[i].name) == JSON.stringify(modifiedObj.name)) {    
            modifiedObj = {
                name: existingData[i].name,
                price: existingData[i].price,
                qty: existingData[i].qty
            }
            modifiedObj.price += (modifiedObj.price / modifiedObj.qty);
            modifiedObj.qty++;
            console.log("modifying local storage data..")
            console.log(modifiedObj)
            existingData[i] = modifiedObj
            const stringifiedModifiedExistingData = JSON.stringify(existingData)
            localStorage.setItem("prodInputted", stringifiedModifiedExistingData);
            tableDataSpecificIndexModifier(existingData[i]);
            break;
        }
    }
}

function addItem(index) {
    console.log("adding item to local storage..");
    let productDataObj = data[index];
    if (LSChecker(productDataObj) == false) {
        console.log(productDataObj)
        let newItem = {
            name: productDataObj.name,
            price: productDataObj.price,
            qty: 1
        };
        let newArrayData = [ ...getLSItem(), { ...newItem }];
        const stringifiedArrayObj = JSON.stringify(newArrayData);
        localStorage.setItem("prodInputted", stringifiedArrayObj);
        tableDataAddRow(newItem);
    }
    else {
        LSModifier(productDataObj);
    }
}

// alternative composedDataRow()
function composedDataRow({ name, price, qty }) {
    const dataRow = document.createElement("tr");
    dataRow.className = "prodData-row";
    const nameCol = document.createElement("td");
    nameCol.className = "prodName-cell";
    const qtyCol = document.createElement("td");
    qtyCol.className = "prodQty-cell";
    const priceCol = document.createElement("td");
    priceCol.className = "prodPrice-cell";
    // assign values into cells 
    nameCol.textContent = name;
    qtyCol.textContent = qty;
    priceCol.textContent = `Rp. ${parseInt(price)}`
    // inserting cells into data table row
    dataRow.appendChild(nameCol)
    dataRow.appendChild(qtyCol)
    dataRow.appendChild(priceCol)

    return dataRow;
}

function tableDataAddRow({ name, price, qty }) {
    const existingData = getLSItem();
    let total = 0;      // resetting total to be recount
    
    let tableBody = document.getElementById('table-body')
    let totalPrice = document.getElementById('total-price')
    const paramObj = {
        name: name,
        price: price,
        qty: qty
    }
    let dataRow = composedDataRow(paramObj);
    tableBody.appendChild(dataRow);
    // recounting total price
    existingData.forEach((product) => {
        total += parseInt(product.price);
    })
    totalPrice.textContent = `Rp. ${total}`;
}

function tableDataSpecificIndexModifier({ name, price, qty }) {
    const existingData = getLSItem();
    let total = 0;      // resetting total to be recount
    const paramObj = {
        name: name,
        price: price,
        qty: qty
    }
    for (let i = 0; i < existingData.length; i++) {
        if(JSON.stringify(existingData[i].name) == JSON.stringify(paramObj.name)) {   
            let modifiedDataRow = document.getElementsByClassName('prodData-row')[i];
            let modifiedCellName = document.getElementsByClassName('prodName-cell')[i];
            let modifiedCellQty = document.getElementsByClassName('prodQty-cell')[i];
            let modifiedCellPrice = document.getElementsByClassName('prodPrice-cell')[i];
            let totalPrice = document.getElementById('total-price') 

            modifiedCellName.textContent = name;
            modifiedCellQty.textContent = qty;
            modifiedCellPrice.textContent = `Rp. ${parseInt(price)}`;            
            // modifying target data row
            modifiedDataRow.appendChild(modifiedCellName);            
            modifiedDataRow.appendChild(modifiedCellQty);            
            modifiedDataRow.appendChild(modifiedCellPrice);
            // recounting total price
            existingData.forEach((product) => {
                total += parseInt(product.price);
            })
            totalPrice.textContent = `Rp. ${total}`;
            break;
        }
    }
}

function tableDataRender() {
    let existingData = getLSItem();
    let tableBody = document.getElementById('table-body')
    const totalPrice = document.getElementById('total-price')
    let total = 0;      
    if (existingData.length) {
        existingData.forEach((product) => {
            let dataRow = composedDataRow(product);
            tableBody.appendChild(dataRow);
            total += parseInt(product.price);
        })
    }
    totalPrice.textContent = `Rp. ${total}`;
}

function resetTableBody() {
    // let tableData = document.getElementById('table-data')
    const newTableBodyMaker = function() {
        let row = document.getElementsByClassName('prodData-row');
        let rowLength = row.length - 1;
        for (let i = rowLength; i >= 0; i--) {
            let deletedRow = document.getElementsByClassName('prodData-row')[i];
            deletedRow.remove();
        }
    }
    newTableBodyMaker();
    tableDataRender();
}

function clearCart() {
    let existingData = getLSItem();
    const cond = confirm("Are you sure want to clear the cart?")
    if (cond) {
        if (existingData.length) {
            console.log("clearing local storage..")
            localStorage.clear()
            resetTableBody();
        }
        else {
            console.log("local storage already empty.")
        }
    }
}

//////////////////////////
function onInit() {
    setAttrBtn();
    tableDataRender();
}

onInit();