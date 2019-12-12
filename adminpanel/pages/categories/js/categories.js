document.addEventListener('DOMContentLoaded', function(e) {

    //Get the modal that opens when click on "إضافة فئة"
    let modal = document.getElementById("createcategory-modal");
    //Get the button that opens the modal
    let addBtn = document.getElementsByClassName("add-button")[0];

    //Get close icon that close the modal
    let span = document.getElementById("close");

    //Get the create button that will craete a new category 
    let createBtn = document.getElementById("createcategory-btn");

    //When the user clicks on "انشاء", update actegories tabel with new category
    let addForm = document.getElementById("category-form");
    addForm.addEventListener("submit", (e) => {


        let tbody = document.getElementsByTagName('tbody')[0];
        let categoryName = document.getElementById("categoryname").value;
        let tr = document.createElement('tr');
        let row = `
      <tr class="user_info">
        <td class="user_no" >${tbody.childElementCount+1}</td>
        <td class="user_full">
            <span class="user_name" style="font-size:18px">` + categoryName + `</span>
        </td>
        <td>
            <select class="selection" style="font-size:18px; border:none; font-family:"Segoe UI"">
                <option value="writer">فعالة</option>
                <option value="admin"> غير فعال</option>
            </select>
        </td>
        <td>
            <i class="fas fa-trash-alt delete_user" style="font-size:20px; color:red; text-align:center; cursor:pointer"></i>
            <i class="far fa-edit icon color-blue"></i>
        </td>
      </tr>`;
        tr.innerHTML = row;
        tbody.appendChild(tr);
        hideModal(modal.id);
        // to database
        e.preventDefault();
        return false;
    });

    //When the user clicks "إضافة فئة" , show the modal 
    addBtn.onclick = function() {
            showModal(modal.id);
        }
        //When the user clicks close icon , close the modal
    span.onclick = function() {
            hideModal(modal.id);
        }
        //When the user clicks anywhere outside of the modal, close it 
    window.onclick = function(event) {
        if (event.target == modal) {
            hideModal(modal.id);
        }
    }

});

function showModal(modalId) {
    document.getElementById(modalId).style.display = "flex";
    document.getElementById("categoryname").value = '';
}

function hideModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}
/**
 * This function create to filter a categories when the user search
 */



const searchByCategory = () => {
    let filter = document.getElementById('search').value.toUpperCase();
    let content = document.getElementById('content');
    let tr = content.getElementsByTagName('tr');

    for (var i = 0; i < tr.length; i++) {
        let td = tr[i].getElementsByTagName('td')[1];

        if (td) {
            let textValue = td.textContent || td.innerHTML;

            if (textValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }


    }



}
/**************************************************************************************************
 * Read categories
 */

let categoriesPage = [{
    id: 1,
    name: "الألعاب",
    isActive: 1,
},
{
    id: 3,
    name: "الرئيسية",
    isActive: 1,
},
{
    id: 2,
    name: "الرياضة",
    isActive: 0, //غير مفعل
},
{
    id: 4,
    name: "الفن",
    isActive: 0,
}
]

function displayCategories(categories) {
    categoriesPage = categories;
    let table = document.getElementById("tablebody");
    for (let i = 0; i < categories.length; i++) {
        let row = document.createElement("tr");
        row.className = "user_info";
        let number = document.createElement("td");
        number.className = "user_no";
        number.textContent = i + 1;

        let info = document.createElement("td");
        info.className = "user_full";
        let info_text = document.createElement("span");
        info_text.className = "user_name ";
        info_text.textContent = categories[i].name;
        info.appendChild(info_text);

        let show_selection = document.createElement("td");
        let select = document.createElement("select");
        select.className = "selection";

        let option1 = document.createElement("option");
        option1.value = 1;
        option1.textContent = "فعال";
        let option2 = document.createElement("option");
        option2.value = 0;
        option2.textContent = "غير فعال";

        select.appendChild(option1);
        select.appendChild(option2);
        select.selectedIndex = !categories[i].isActive;
        show_selection.appendChild(select);

        let operations = document.createElement("td");
        let delete_icon = document.createElement("i");
        delete_icon.className = "fas fa-trash-alt delete_user";
        
        let edit_icon = document.createElement("i");
        edit_icon.className = "far fa-edit icon color-blue";

        operations.appendChild(delete_icon);
        operations.appendChild(edit_icon);

        row.appendChild(number);
        row.appendChild(info);
        row.appendChild(show_selection);
        row.appendChild(operations);

        table.appendChild(row);
    }
}

document.addEventListener("DOMContentLoaded", (event) => {

    displayCategories(categoriesPage);
});
