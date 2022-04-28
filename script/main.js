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
        price: 25_000,
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
        // console.log(existingData[i].name)
        if(JSON.stringify(existingData[i].name) == JSON.stringify(modifiedObj.name)) {    
            modifiedObj = {
                name: existingData[i].name,
                price: existingData[i].price,
                qty: existingData[i].qty
            }
            modifiedObj.price += (Math.floor(modifiedObj.price/modifiedObj.qty));
            modifiedObj.qty++;
            console.log("Modifying data..")
            console.log(modifiedObj)
            existingData[i] = modifiedObj
        }
    }
    const stringifiedModifiedExistingData = JSON.stringify(existingData)
    return localStorage.setItem("prodInputted", stringifiedModifiedExistingData);
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
        const stringifiedArrayObj = JSON.stringify(newArrayData)
        return localStorage.setItem("prodInputted", stringifiedArrayObj);
    }

    LSModifier(productDataObj);
}

function dataToBeShown({ name, price, qty }) {
    const dataRow = document.createElement("tr");
    const nameCol = document.createElement("td");
    const qtyCol = document.createElement("td");
    const priceCol = document.createElement("td");
    
    nameCol.textContent = name;
    qtyCol.textContent = qty;
    priceCol.textContent = `Rp. ${parseInt(price)}`

    dataRow.appendChild(nameCol)
    dataRow.appendChild(qtyCol)
    dataRow.appendChild(priceCol)

    return dataRow;
}

function showItem() {
    let existingData = getLSItem();
    let tableBody = document.getElementById('table-body')
    const totalPrice = document.getElementById('total-price')
    let total = 0;

    if (existingData.length) {
        // existingData.forEach((dataExist) => {
        //     tableBody.appendChild(dataToBeShown(dataExist))
        //     total += parseInt(dataExist.price);
        // })
        for (let i = 0; i< existingData.length; i++) {
            tableBody.appendChild(dataToBeShown(existingData[i]))
            total += parseInt(existingData[i].price)
        }
    }
    totalPrice.textContent = `Rp. ${total}`;
}


function clearCart() {
    const cond = confirm("Are you sure want to clear the cart?")
    if (cond)
        localStorage.clear()
}

function onInit() {
    setAttrBtn();
    showItem();
}

onInit();