let data = [
    {
        name: "Nasi Goreng",
        price: "25_000"
    },
    {
        name: "Gado Gado",
        price: "20_000"
    },
    {
        name: "Pecel Lele",
        price: "25_000"
    },
    {
        name: "Mie Bakso",
        price: "25_000"
    }
]

let dataInputtedStructure = {
    name: "",
    price: "",
    qty: ""
}

/**
 * Set different onclick function for different button   
 */
function setAttrBtn() {
    const btn = document.getElementsByTagName('button')
    const numberOfBtn = btn.length;

    for (let i = 0; i < numberOfBtn; i++) {
        btn[i].onclick = `addItem(${i})`
    }
}

/**
 * @returns {object[]}
 */
function getLSItem() {
    return localStorage.getItem('prodInputted') || [];
} 

function LSChecker(inputtedObj) {
    const existingData = getLSItem();
    existingData.forEach((dataExist) => {
        if (inputtedObj == dataExist)        
            return true
    })
    return false
}

function addItem(index) {
    // const existingData = getLSItem();
    const productDataObj = data[index];
    if (LSChecker(productDataObj[index]) == false) {
        const newItem = {
            name: data.name,
            price: data.price,
            qty: 1
        }
        // newItem.qty = 1;
        let newArrayData = [ ...getLSItem(), { ...newItem }];
        return localStorage.setItem(JSON.stringify('prodInputted', newArrayData))
    }
    return ;
}

function dataToBeShown({ name, price, qty }) {
    const dataRow = document.createElement("tr");
    const nameCol = document.createElement("td");
    const qtyCol = document.createElement("td");
    const priceCol = document.createElement("td");
    
    nameCol.textContent = name;
    qtyCol.texContent = qty;
    priceCol.textContent = parseInt(price)

    nameCol.appendChild(dataRow)
    qtyCol.appendChild(dataRow)
    priceCol.appendChild(dataRow)

    return dataRow;
}

function showItem() {
    const existingData = getLSItem();
    const tableBody = document.getElementById('table-body')
    const totalPrice = document.getElementById('total-price')
    let total = 0;

    existingData.forEach((prodData) =>{
        dataToBeShown(prodData).appendChild(tableBody)
        total += prodData.price;
    })
    totalPrice.textContent = total;
}