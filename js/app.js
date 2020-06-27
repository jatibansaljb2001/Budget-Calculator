class UI {
    constructor() {
        this.budgetFeedback = document.querySelector(".budget-feedback");
        this.expenseFeedback = document.querySelector(".expense-feedback");
        this.budgetForm = document.getElementById("budget-form");
        this.budgetInput = document.getElementById("budget-input");
        this.budgetAmount = document.getElementById("budget-amount");
        this.expenseAmount = document.getElementById("expense-amount");
        this.balance = document.getElementById("balance");
        this.balanceAmount = document.getElementById("balance-amount");
        this.expenseForm = document.getElementById("expense-form");
        this.expenseInput = document.getElementById("expense-input");
        this.amountInput = document.getElementById("amount-input");
        this.expenseList = document.getElementById("expense-list");
        this.itemList = [];
        this.itemID = 0;
    }

    //submit budget form
    submitBudgetForm() {
        const value = this.budgetInput.value;
        const budgetFeedbackList = this.budgetFeedback.classList;
        if (value === '' || value <= 0) {
            budgetFeedbackList.add("showItem");
            this.budgetFeedback.innerHTML = `<p>Budget Cannot Be Empty or Negative<p>`;
            setTimeout(() => {
                budgetFeedbackList.remove("showItem");
            }, 4000);
        } else {
            this.budgetAmount.textContent = value;
            this.budgetInput.value = "";
            this.showBalance();
        }
    }
    showBalance() {
        const expense = this.totalExpense();
        const total = parseInt(this.budgetAmount.textContent) - expense;
        this.balanceAmount.textContent = total;
        if (total < 0) {
            this.balance.classList.remove("showBlack", "showGreen");
            this.balance.classList.add("showRed");
        }
        if (total > 0) {
            this.balance.classList.remove("showBlack", "showRed");
            this.balance.classList.add("showGreen");
        }
        if (total === 0) {
            this.balance.classList.remove("showGreen", "showRed");
            this.balance.classList.add("showBlack");
        }
    }

    submitExpenseForm() {
        const expenseValue = this.expenseInput.value;
        const amountValue = this.amountInput.value;
        const expenseFeedbackList = this.expenseFeedback.classList;
        if (expenseValue === '' || amountValue === '' || amountValue < 0) {
            expenseFeedbackList.add("showItem");
            this.expenseFeedback.innerHTML = `<p>Expense Value Cannot Be Negative Or Zero<p>`;
            setTimeout(() => {
                expenseFeedbackList.remove("showItem");
            }, 4000);
        } else {
            let amount = parseInt(amountValue);
            this.expenseInput.value = '';
            this.amountInput.value = '';
            let expense = {
                id: this.itemID,
                title: expenseValue,
                amount: amount
            }
            this.itemID++;
            this.itemList.push(expense);
            this.addExpense(expense);
            this.showBalance();
        }
    }
    addExpense(expense) {
        const div = document.createElement('div');
        div.classList.add('expense');
        div.innerHTML = `
        <div class="expense-item d-flex justify-content-between align-items-baseline">

         <h6 class="expense-title mb-0 text-uppercase list-item">- ${expense.title}</h6>
         <h5 class="expense-amount mb-0 list-item">${expense.amount}</h5>

         <div class="expense-icons list-item">

          <a href="#" class="edit-icon mx-2" data-id="${expense.id}">
           <i class="fas fa-edit"></i>
          </a>
          <a href="#" class="delete-icon" data-id="${expense.id}">
           <i class="fas fa-trash"></i>
          </a>
         </div>
        </div>
        `;
        this.expenseList.appendChild(div);
    }

    totalExpense() {
        let total = 0;
        if (this.itemList.length > 0) {
            total = this.itemList.reduce((acc, curr) => {
                acc += curr.amount;
                return acc;
            }, 0);
        }
        this.expenseAmount.textContent = total;
        return total;
    }

    editExpense(element) {
        let id = parseInt(element.dataset.id);
        let parent = element.parentElement.parentElement.parentElement;
        this.expenseList.removeChild(parent);
        let expense = this.itemList.filter((item) => {
            return item.id === id;
        })
        this.expenseInput.value = expense[0].title;
        this.amountInput.value = expense[0].amount;
        let tempList = this.itemList.filter((item) => {
            return item.id !== id;
        })
        this.itemList = tempList;
        this.showBalance();
    }

    deleteExpense(element) {
        let id = parseInt(element.dataset.id);
        let parent = element.parentElement.parentElement.parentElement;
        this.expenseList.removeChild(parent);
        let tempList = this.itemList.filter((item) => {
            return item.id !== id;
        })
        this.itemList = tempList;
        this.showBalance();
    }
}

function eventListeners() {
    const budgetForm = document.getElementById("budget-form");
    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");

    // instance for UI class
    const ui = new UI();

    // budget form submit
    budgetForm.addEventListener("submit", (event) => {
        event.preventDefault();
        ui.submitBudgetForm();
    });
    expenseForm.addEventListener("submit", (event) => {
        event.preventDefault();
        ui.submitExpenseForm();

    });
    expenseList.addEventListener("click", (event) => {
        if (event.target.parentElement.classList.contains('edit-icon')) {
            ui.editExpense(event.target.parentElement)
        } else if (event.target.parentElement.classList.contains('delete-icon')) {
            ui.deleteExpense(event.target.parentElement)
        }
    });

}

document.addEventListener("DOMContentLoaded", () => {
    eventListeners();
})